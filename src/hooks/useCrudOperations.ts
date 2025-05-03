import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { message } from "../utils/message";

interface CrudApi<T, C, U> {
  create: (data: C) => Promise<T>;
  update: (id: number, data: U) => Promise<T>;
  delete: (id: number) => Promise<any>;
}

interface CrudMessages {
  createSuccess?: string;
  createError?: string;
  updateSuccess?: string;
  updateError?: string;
  deleteSuccess?: string;
  deleteError?: string;
}

interface UseCrudOperationsResult<T, C, U> {
  createMutation: UseMutationResult<T, Error, C, unknown>;
  updateMutation: UseMutationResult<T, Error, { id: number; data: U }, unknown>;
  deleteMutation: UseMutationResult<any, Error, number, unknown>;
}

/**
 * 通用CRUD操作Hook
 *
 * 封装了创建、更新、删除等常用操作的逻辑
 *
 * @param api CRUD API对象
 * @param queryKey 查询键，用于刷新数据
 * @param messages 操作消息配置
 * @returns CRUD操作的mutation对象
 */
export function useCrudOperations<T, C, U>(
  api: CrudApi<T, C, U>,
  queryKey: string | string[],
  messages: CrudMessages = {}
): UseCrudOperationsResult<T, C, U> {
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
    mutationFn: ({ id, data }: { id: number; data: U }) => api.update(id, data),
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

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
