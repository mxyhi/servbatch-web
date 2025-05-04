/**
 * 实体相关类型定义
 */
import { ReactNode } from "react";

import { TablePaginationConfig } from "antd/es/table";
import { UseMutationResult } from "@tanstack/react-query";

import { FormItem } from "./form";
import { ID, PaginationParams, PaginatedResponse } from "./common";

// 实体表格配置
export interface EntityTableConfig {
  columns: Array<Record<string, unknown>>;
  rowKey?: string;
  pagination?: TablePaginationConfig | false;
  showIndex?: boolean;
  selectable?: boolean;
  toolbar?: ReactNode;
}

// 实体表单配置
export interface EntityFormConfig {
  items: FormItem[];
  layout?: "horizontal" | "vertical" | "inline";
  columns?: number;
  gutter?: number;
}

// 实体操作配置
export interface EntityOperations<T, C, U> {
  onCreate?: (data: C) => Promise<T>;
  onUpdate?: (id: ID, data: U) => Promise<T>;
  onDelete?: (id: ID) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

// 实体API接口
export interface EntityApi<T, C, U> {
  // 获取所有实体
  getAll: () => Promise<T[]>;

  // 获取分页实体
  getPaginated?: (
    params?: PaginationParams & Record<string, any>
  ) => Promise<PaginatedResponse<T>>;

  // 获取单个实体
  getById?: (id: ID) => Promise<T>;

  // 创建实体
  create: (data: C) => Promise<T>;

  // 更新实体
  update: (id: ID, data: U) => Promise<T>;

  // 删除实体
  delete: (id: ID) => Promise<unknown>;

  // 自定义操作
  [key: string]: unknown;
}

// 消息配置接口
export interface EntityMessages {
  createSuccess?: string;
  createError?: string;
  updateSuccess?: string;
  updateError?: string;
  deleteSuccess?: string;
  deleteError?: string;
  [key: string]: string | undefined;
}

// 自定义操作配置
export interface CustomOperation<T, P> {
  // 操作函数
  operation: (params: P) => Promise<T>;

  // 操作成功消息
  successMessage?: string;

  // 操作失败消息
  errorMessage?: string;

  // 是否在操作成功后刷新查询
  invalidateQueriesOnSuccess?: boolean;
}

// 实体CRUD Hook配置
export interface EntityCRUDConfig<T, C, U> {
  // 实体API
  api: EntityApi<T, C, U>;

  // 查询键
  queryKey: string | string[];

  // 消息配置
  messages?: EntityMessages;

  // 自定义操作
  customOperations?: Record<string, CustomOperation<unknown, unknown>>;

  // 自动刷新配置
  autoRefresh?: boolean;

  // 刷新间隔
  refreshInterval?: number;

  // 查询选项
  queryOptions?: Record<string, unknown>;

  // 是否使用分页
  usePagination?: boolean;

  // 默认分页参数
  defaultPaginationParams?: PaginationParams & Record<string, any>;

  // 是否在过滤条件变化时重置页码
  resetPageOnFilterChange?: boolean;
}

// 实体CRUD Hook返回值
export interface EntityCRUDResult<T, C, U> {
  // 数据和加载状态
  data: T[] | undefined;
  isLoading: boolean;
  refetch: () => Promise<unknown>;

  // 分页数据（如果启用分页）
  paginatedData?: PaginatedResponse<T>;
  paginationParams?: PaginationParams & Record<string, any>;
  setPaginationParams?: (
    params: Partial<PaginationParams & Record<string, any>>
  ) => void;
  resetPagination?: () => void;
  tablePaginationConfig?: TablePaginationConfig;
  handleTableChange?: (
    pagination: TablePaginationConfig,
    filters?: Record<string, any>,
    sorter?: any
  ) => void;

  // 基本CRUD操作
  createMutation: UseMutationResult<T, Error, C, unknown>;
  updateMutation: UseMutationResult<T, Error, { id: ID; data: U }, unknown>;
  deleteMutation: UseMutationResult<unknown, Error, ID, unknown>;

  // 自定义操作
  customMutations: Record<
    string,
    UseMutationResult<unknown, Error, unknown, unknown>
  >;

  // 获取单个实体
  getById: (id: ID) => T | undefined;
}
