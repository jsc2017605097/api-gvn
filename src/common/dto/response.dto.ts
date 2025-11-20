export class PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
  timestamp: string;

  constructor(
    data: T,
    meta?: PaginationMeta,
    message?: string,
    success: boolean = true,
  ) {
    this.success = success;
    this.data = data;
    this.meta = meta;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    data: T,
    meta?: PaginationMeta,
    message?: string,
  ): ApiResponse<T> {
    return new ApiResponse(data, meta, message, true);
  }

  static error<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(data || ({} as T), undefined, message, false);
  }
}

