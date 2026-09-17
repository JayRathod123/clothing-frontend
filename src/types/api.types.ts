export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  requestId?: string;
  timestamp?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
