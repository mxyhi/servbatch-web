import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { message } from "../../utils/message";
import { CustomOperation } from "../../types/entity";

interface UseCustomOperationsOptions {
  customOperations: Record<string, CustomOperation<unknown, unknown>>;
  queryKey: string[];
}

/**
 * 自定义操作Hook
 * 
 * 处理实体的自定义操作
 */
export function useCustomOperations({
  customOperations,
  queryKey,
}: UseCustomOperationsOptions): Record<string, UseMutationResult<unknown, Error, unknown, unknown>> {
  const queryClient = useQueryClient();
  const customMutations: Record<string, UseMutationResult<unknown, Error, unknown, unknown>> = {};

  Object.entries(customOperations).forEach(([key, config]) => {
    customMutations[key] = useMutation({
      mutationFn: config.operation,
      onSuccess: () => {
        if (config.invalidateQueriesOnSuccess !== false) {
          queryClient.invalidateQueries({ queryKey });
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

  return customMutations;
}
