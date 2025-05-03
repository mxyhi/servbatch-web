import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { message } from "../../utils/message";
import { EntityApi, EntityMessages } from "../../types/entity";
import { ID } from "../../types/common";

interface UseMutationsOptions<T, C, U> {
  api: EntityApi<T, C, U>;
  queryKey: string[];
  messages: EntityMessages;
}

interface UseMutationsResult<T, C, U> {
  createMutation: UseMutationResult<T, Error, C, unknown>;
  updateMutation: UseMutationResult<T, Error, { id: ID; data: U }, unknown>;
  deleteMutation: UseMutationResult<unknown, Error, ID, unknown>;
}

/**
 * 实体操作Mutations Hook
 * 
 * 提供创建、更新、删除等基本操作的mutation
 */
export function useMutations<T, C, U>({
  api,
  queryKey,
  messages,
}: UseMutationsOptions<T, C, U>): UseMutationsResult<T, C, U> {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey });
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
    mutationFn: ({ id, data }: { id: ID; data: U }) => api.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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
      queryClient.invalidateQueries({ queryKey });
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
