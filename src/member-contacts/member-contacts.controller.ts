import { Controller, Get, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MemberContactsService } from './member-contacts.service';
import { QueryMemberContactsDto, FilterDto } from '../common/dto/pagination.dto';

interface ParsedQueryDto {
  page: number;
  limit: number;
  filter: FilterDto;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

interface ApiResponseFormat {
  message: string;
  error: boolean;
  data: {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
}

interface DetailApiResponseFormat {
  message: string;
  error: boolean;
  data: any;
}

@Controller('member-contacts')
export class MemberContactsController {
  constructor(private readonly memberContactsService: MemberContactsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: any,
  ): Promise<ApiResponseFormat> {
    // Initialize filter object - always ensure it exists
    let filter: FilterDto = {};

    // Parse filter from query
    if (query.filter) {
      try {
        filter = typeof query.filter === 'string' 
          ? JSON.parse(query.filter) 
          : query.filter;
      } catch (e) {
        // If filter is not valid JSON, treat it as empty
        filter = {};
      }
    }

    // Parse sort
    let sort: { field: string; order: 'asc' | 'desc' } | undefined;
    if (query.sort) {
      try {
        const parsedSort = typeof query.sort === 'string' 
          ? JSON.parse(query.sort) 
          : query.sort;
        sort = {
          field: parsedSort.field || '_id',
          order: parsedSort.order === 'asc' ? 'asc' : 'desc',
        };
      } catch (e) {
        // If sort is not valid JSON, use default
        sort = { field: '_id', order: 'desc' };
      }
    } else if (query.sortField || query.sortOrder) {
      // Support simple sort params: sortField and sortOrder
      sort = {
        field: query.sortField || '_id',
        order: query.sortOrder === 'asc' ? 'asc' : 'desc',
      };
    }
    
    // Support individual filter params - add to existing filter
    const stringFields = [
      'contact_no', 'account_no', 'club_code', 'name', 
      'mobile_phone_no', 'phone_no', 'scheme_code', 
      'filter_created_date'
    ];
    
    const booleanFields = ['main_contact', 'send_receipt_by_email'];
    
    stringFields.forEach(field => {
      if (query[field] !== undefined) {
        filter[field] = query[field];
      }
    });
    
    booleanFields.forEach(field => {
      if (query[field] !== undefined) {
        const value = query[field];
        if (typeof value === 'string') {
          filter[field] = value === 'true' || value === '1';
        } else {
          filter[field] = Boolean(value);
        }
      }
    });

    // Build parsed query with guaranteed filter
    const parsedQuery: ParsedQueryDto = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
      filter,
      ...(sort && { sort }),
    };

    // Convert to QueryMemberContactsDto format for service
    const serviceQuery: QueryMemberContactsDto = {
      page: parsedQuery.page,
      limit: parsedQuery.limit,
      filter: parsedQuery.filter,
      sort: parsedQuery.sort,
      search: query.search, // Thêm tham số search
    };

    return await this.memberContactsService.findAll(serviceQuery);
  }

  @Get(':member_contact')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('member_contact') memberContact: string,
  ): Promise<DetailApiResponseFormat> {
    return await this.memberContactsService.findOneByMemberContact(memberContact);
  }
}

