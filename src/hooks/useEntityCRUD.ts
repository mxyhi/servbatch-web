import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { message } from "antd";
import { DEFAULT_REFRESH_INTERVAL } from "../constants";

/**
 * 实体API接口定义
 * 定义了实体的基本CRUD操作
 */
export interface EntityApi<T, C, U> {
  // 获取所有实体
  getAll: () => Promise<T[]>;
  
  // 获取单个实体
  getById?: (id: number) => Promise<T>;
  
  // 创建实体
  create: (data: C) => Promise<T>;
  
  // 更新实体
  update: (id: number, data: U) => Promise<T>;
  
  // 删除实体
  delete: (id: number) => Promise<any>;
  
  // 自定义操作
  [key: string]: any;
}

/**
 * 消息配置接口
 * 用于自定义操作成功和失败的消息
 */
export interface EntityMessages {
  createSuccess?: string;
  createError?: string;
  updateSuccess?: string;
  updateError?: string;
  deleteSuccess?: string;
  deleteError?: string;
  [key: string]: string | undefined;
}

/**
 * 自定义操作配置
 * 用于配置额外的实体操作
 */
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

/**
 * 实体CRUD Hook配置
 */
export interface EntityCRUDConfig<T, C, U> {
  // 实体API
  api: EntityApi<T, C, U>;
  
  // 查询键
  queryKey: string | string[];
  
  // 消息配置
  messages?: EntityMessages;
  
  // 自定义操作
  customOperations?: Record<string, CustomOperation<any, any>>;
  
  // 自动刷新配置
  autoRefresh?: boolean;
  
  // 刷新间隔
  refreshInterval?: number;
  
  // 查询选项
  queryOptions?: any;
}

/**
 * 实体CRUD Hook返回值
 */
export interface EntityCRUDResult<T, C, U> {
  // 数据和加载状态
  data: T[] | undefined;
  isLoading: boolean;
  refetch: () => Promise<any>;
  
  // 基本CRUD操作
  createMutation: UseMutationResult<T, Error, C, unknown>;
  updateMutation: UseMutationResult<T, Error, { id: number; data: U }, unknown>;
  deleteMutation: UseMutationResult<any, Error, number, unknown>;
  
  // 自定义操作
  customMutations: Record<string, UseMutationResult<any, Error, any, unknown>>;
  
  // 获取单个实体
  getById: (id: number) => T | undefined;
}

/**
 * 通用实体CRUD Hook
 * 
 * 提供统一的实体CRUD操作，支持自定义操作、自动刷新等功能
 * 
 * @param config Hook配置
 * @returns 实体CRUD操作结果
 */
export function useEntityCRUD<T extends { id: number }, C, U = Partial<C>>({
  api,
  queryKey,
  messages = {},
  customOperations = {},
  autoRefresh = false,
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  queryOptions = {},
}: EntityCRUDConfig<T, C, U>): EntityCRUDResult<T, C, U> {
  const queryClient = useQueryClient();
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  // 默认消息
  const defaultMessages = {
    createSuccess: "创建成功",
    createError: "创建失败",
    updateSuccess: "更新成功",
    updateError: "更新失败",
    deleteSuccess: "删除成功",
    deleteError: "删除失败",
  };
  
  // 合并消息
  const finalMessages = { ...defaultMessages, ...messages };
  
  // 获取所有实体
  const { 
    data, 
    isLoading, 
    refetch 
  } = useQuery<T[]>({
    queryKey: queryKeyArray,
    queryFn: api.getAll,
    refetchInterval: autoRefresh ? refreshInterval : false,
    ...queryOptions,
  });
  
  // 创建实体
  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyArray });
      message.success(finalMessages.createSuccess);
    },
    onError: (error) => {
      message.error(
        `${finalMessages.createError}: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    },
  });
  
  // 更新实体
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: U }) =>
      api.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyArray });
      message.success(finalMessages.updateSuccess);
    },
    onError: (error) => {
      message.error(
        `${finalMessages.updateError}: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    },
  });
  
  // 删除实体
  const deleteMutation = useMutation({
    mutationFn: api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyArray });
      message.success(finalMessages.deleteSuccess);
    },
    onError: (error) => {
      message.error(
        `${finalMessages.deleteError}: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    },
  });
  
  // 创建自定义操作
  const customMutations: Record<string, UseMutationResult<any, Error, any, unknown>> = {};
  
  Object.entries(customOperations).forEach(([key, config]) => {
    customMutations[key] = useMutation({
      mutationFn: config.operation,
      onSuccess: () => {
        if (config.invalidateQueriesOnSuccess !== false) {
          queryClient.invalidateQueries({ queryKey: queryKeyArray });
        }
        if (config.successMessage) {
          message.success(config.successMessage);
        }
      },
      onError: (error) => {
        if (config.errorMessage) {
          message.error(
            `${config.errorMessage}: ${
              error instanceof Error ? error.message : "未知错误"
            }`
          );
        }
      },
    });
  });
  
  // 根据ID获取实体
  const getById = (id: number): T | undefined => {
    return data?.find((item) => item.id === id);
  };
  
  return {
    // 数据和加载状态
    data,
    isLoading,
    refetch,
    
    // 基本CRUD操作
    createMutation,
    updateMutation,
    deleteMutation,
    
    // 自定义操作
    customMutations,
    
    // 获取单个实体
    getById,
  };
}
