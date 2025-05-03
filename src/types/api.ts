/**
 * API相关类型定义
 */
import { ID } from './common';

// API错误
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// API响应包装
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 基础实体接口
export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

// 基础CRUD API接口
export interface CrudApi<T extends BaseEntity, C, U> {
  getAll: () => Promise<T[]>;
  getById?: (id: ID) => Promise<T>;
  create: (data: C) => Promise<T>;
  update: (id: ID, data: U) => Promise<T>;
  delete: (id: ID) => Promise<unknown>;
}

// 分页API接口
export interface PaginatedApi<T extends BaseEntity, C, U> extends Omit<CrudApi<T, C, U>, 'getAll'> {
  getAll: (params?: Record<string, unknown>) => Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}

// 服务器状态
export type ServerStatus = 'online' | 'offline' | 'unknown';

// 执行状态
export type ExecutionStatus = 'completed' | 'failed' | 'running' | 'queued' | 'cancelled';
