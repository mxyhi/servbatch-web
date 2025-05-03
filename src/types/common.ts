/**
 * 通用类型定义
 */

// 通用状态类型
export type Status = 'online' | 'offline' | 'unknown';

// 通用ID类型
export type ID = number | string;

// 通用分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 通用分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 通用操作结果
export interface OperationResult {
  success: boolean;
  message?: string;
}

// 通用查询参数
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// 表格大小类型
export type TableSize = 'small' | 'middle' | 'large';

// 表单布局类型
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
