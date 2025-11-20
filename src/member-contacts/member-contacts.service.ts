import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberContact, MemberContactDocument } from './schemas/member-contact.schema';
import { QueryMemberContactsDto, FilterDto, SortDto } from '../common/dto/pagination.dto';
import { createVietnameseRegex } from '../common/utils/string.util';

interface MemberContactResponse {
  _id: string;
  contact_no: string;
  _created_at: Date;
  _updated_at: Date;
  account_no: string;
  club_code: string;
  filter_created_date: string;
  main_contact: boolean;
  mobile_phone_no: string;
  name: string;
  phone_no: string;
  scheme_code: string;
  send_receipt_by_email: boolean;
}

interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface ApiResponseFormat {
  message: string;
  error: boolean;
  data: {
    data: MemberContactResponse[];
    pagination: PaginationResponse;
  };
}

@Injectable()
export class MemberContactsService {
  constructor(
    @InjectModel(MemberContact.name)
    private memberContactModel: Model<MemberContactDocument>,
  ) {}

  async findAll(query: QueryMemberContactsDto): Promise<ApiResponseFormat> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter object - ensure filter always exists
    const filter: any = {};
    
    // Process filter if provided
    if (query.filter) {
      const filterData: FilterDto = query.filter;
      
      if (filterData.contact_no) {
        filter.contact_no = { $regex: filterData.contact_no, $options: 'i' };
      }
      
      if (filterData.account_no) {
        filter.account_no = { $regex: filterData.account_no, $options: 'i' };
      }
      
      if (filterData.club_code) {
        filter.club_code = filterData.club_code;
      }
      
      if (filterData.name) {
        filter.name = { $regex: filterData.name, $options: 'i' };
      }
      
      if (filterData.mobile_phone_no) {
        filter.mobile_phone_no = { $regex: filterData.mobile_phone_no, $options: 'i' };
      }
      
      if (filterData.phone_no) {
        filter.phone_no = { $regex: filterData.phone_no, $options: 'i' };
      }
      
      if (filterData.scheme_code) {
        filter.scheme_code = filterData.scheme_code;
      }
      
      if (filterData.filter_created_date) {
        filter.filter_created_date = filterData.filter_created_date;
      }
      
      if (filterData.main_contact !== undefined) {
        filter.main_contact = filterData.main_contact;
      }
      
      if (filterData.send_receipt_by_email !== undefined) {
        filter.send_receipt_by_email = filterData.send_receipt_by_email;
      }
    }

    // Process search parameter - search theo tên hoặc số điện thoại (không phân biệt dấu)
    if (query.search && query.search.trim()) {
      const searchText = query.search.trim();
      const searchRegex = createVietnameseRegex(searchText);
      
      // Nếu có search, ưu tiên search và bỏ qua filter về name, mobile_phone_no, phone_no
      // Xóa các filter về name, mobile_phone_no, phone_no nếu có
      delete filter.name;
      delete filter.mobile_phone_no;
      delete filter.phone_no;
      
      // Tạo $or condition để search trong name, mobile_phone_no, phone_no
      const searchConditions: any[] = [
        { name: { $regex: searchRegex } },
        { mobile_phone_no: { $regex: searchRegex } },
        { phone_no: { $regex: searchRegex } },
      ];
      
      // Nếu đã có filter khác, kết hợp với $and
      const otherFilters: any = {};
      Object.keys(filter).forEach(key => {
        if (key !== '$and' && key !== '$or') {
          otherFilters[key] = filter[key];
        }
      });
      
      if (Object.keys(otherFilters).length > 0 || filter.$and || filter.$or) {
        // Có filter khác, dùng $and để kết hợp
        const andConditions: any[] = [];
        
        // Thêm các filter khác
        Object.keys(otherFilters).forEach(key => {
          andConditions.push({ [key]: otherFilters[key] });
        });
        
        // Thêm $or search
        andConditions.push({ $or: searchConditions });
        
        // Giữ lại $and và $or cũ nếu có
        if (filter.$and) {
          andConditions.push(...filter.$and);
        }
        if (filter.$or) {
          andConditions.push({ $or: filter.$or });
        }
        
        // Xóa tất cả và tạo $and mới
        Object.keys(filter).forEach(key => delete filter[key]);
        filter.$and = andConditions;
      } else {
        // Chỉ có search, dùng $or
        filter.$or = searchConditions;
      }
    }

    // Build sort object
    const sort: any = {};
    if (query.sort) {
      const sortField = query.sort.field || '_id';
      const sortOrder = query.sort.order === 'asc' ? 1 : -1;
      sort[sortField] = sortOrder;
    } else {
      sort._id = -1; // Default sort by _id descending
    }

    // Execute query
    const [data, totalItems] = await Promise.all([
      this.memberContactModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.memberContactModel.countDocuments(filter).exec(),
    ]);

    // Transform data - chỉ lấy các trường có trong database
    const memberContacts: MemberContactResponse[] = data.map((item: any) => ({
      _id: item._id.toString(),
      contact_no: item.contact_no || '',
      _created_at: item._created_at,
      _updated_at: item._updated_at,
      account_no: item.account_no || '',
      club_code: item.club_code || '',
      filter_created_date: item.filter_created_date || '',
      main_contact: item.main_contact || false,
      mobile_phone_no: item.mobile_phone_no || '',
      name: item.name || '',
      phone_no: item.phone_no || '',
      scheme_code: item.scheme_code || '',
      send_receipt_by_email: item.send_receipt_by_email || false,
    }));

    // Build pagination
    const totalPages = Math.ceil(totalItems / limit);
    const pagination: PaginationResponse = {
      total: totalItems,
      page: page,
      limit: limit,
      total_pages: totalPages,
    };

    // Return new format
    return {
      message: 'Lấy danh sách khách hàng thành công',
      error: false,
      data: {
        data: memberContacts,
        pagination: pagination,
      },
    };
  }
}

