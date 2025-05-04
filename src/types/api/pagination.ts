/**
 * 分页相关类型定义
 */
import { BaseEntity, CrudApi } from "./common";

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 分页结果
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页API接口
export interface PaginatedApi<T extends BaseEntity, C, U>
  extends Omit<CrudApi<T, C, U>, "getAll"> {
  getAll: (params?: Record<string, unknown>) => Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}
