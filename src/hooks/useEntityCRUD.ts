import { useQuery } from "@tanstack/react-query";
import { DEFAULT_REFRESH_INTERVAL } from "../constants";
import { useMutations, useCustomOperations } from "./entity";
import { EntityApi, EntityCRUDConfig, EntityCRUDResult } from "../types/entity";
import { ID } from "../types/common";

/**
 * 通用实体CRUD Hook
 *
 * 提供统一的实体CRUD操作，支持自定义操作、自动刷新等功能
 *
 * @param config Hook配置
 * @returns 实体CRUD操作结果
 */
export function useEntityCRUD<T extends { id: ID }, C, U = Partial<C>>({
  api,
  queryKey,
  messages = {},
  customOperations = {},
  autoRefresh = false,
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  queryOptions = {},
}: EntityCRUDConfig<T, C, U>): EntityCRUDResult<T, C, U> {
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];

  // 获取所有实体
  const { data, isLoading, refetch } = useQuery<T[]>({
    queryKey: queryKeyArray,
    queryFn: api.getAll,
    refetchInterval: autoRefresh ? refreshInterval : false,
    ...queryOptions,
  });

  // 获取基本CRUD操作
  const { createMutation, updateMutation, deleteMutation } = useMutations<
    T,
    C,
    U
  >({
    api,
    queryKey: queryKeyArray,
    messages,
  });

  // 获取自定义操作
  const customMutations = useCustomOperations({
    customOperations,
    queryKey: queryKeyArray,
  });

  // 根据ID获取实体
  const getById = (id: ID): T | undefined => {
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
