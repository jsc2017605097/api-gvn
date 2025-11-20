import { IsOptional, IsInt, Min, Max, IsString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class FilterDto {
  @IsOptional()
  @IsString()
  contact_no?: string;

  @IsOptional()
  @IsString()
  account_no?: string;

  @IsOptional()
  @IsString()
  club_code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  mobile_phone_no?: string;

  @IsOptional()
  @IsString()
  phone_no?: string;

  @IsOptional()
  @IsString()
  scheme_code?: string;

  @IsOptional()
  @IsString()
  filter_created_date?: string;

  @IsOptional()
  @Type(() => Boolean)
  main_contact?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  send_receipt_by_email?: boolean;
}

export class SortDto {
  @IsOptional()
  @IsString()
  field?: string = '_id';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}

export class QueryMemberContactsDto extends PaginationDto {
  @IsOptional()
  @IsObject()
  filter?: FilterDto;

  @IsOptional()
  @IsObject()
  sort?: SortDto;

  @IsOptional()
  @IsString()
  search?: string;
}

