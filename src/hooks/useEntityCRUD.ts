import { useQuery } from "@tanstack/react-query";
import { DEFAULT_REFRESH_INTERVAL } from "../constants";
import { useMutations, useCustomOperations } from "./entity";
import { EntityApi, EntityCRUDConfig, EntityCRUDResult } from "../types/entity";
import { ID, PaginatedResponse } from "../types/common";
import usePagination from "./usePagination";

/**
 * 通用实体CRUD Hook
 *
 * 提供统一的实体CRUD操作，支持自定义操作、自动刷新、分页等功能
 *
 * @param config Hook配置
 * @returns 实体CRUD操作结果
 *
 * @example
 * ```tsx
 * // 基本用法
 * const { data, isLoading, createMutation, updateMutation, deleteMutation } = useEntityCRUD({
 *   api: userApi,
 *   queryKey: 'users',
 *   messages: {
 *     createSuccess: '用户创建成功',
 *     updateSuccess: '用户更新成功',
 *     deleteSuccess: '用户删除成功',
 *   }
 * });
 *
 * // 使用分页
 * const {
 *   data,
 *   paginatedData,
 *   tablePaginationConfig,
 *   handleTableChange,
 *   isLoading
 * } = useEntityCRUD({
 *   api: {
 *     getAll: userApi.getAllUsers,
 *     getPaginated: userApi.getUsersPaginated,
 *     getById: userApi.getUser,
 *     create: userApi.createUser,
 *     update: userApi.updateUser,
 *     delete: userApi.deleteUser
 *   },
 *   queryKey: 'users',
 *   usePagination: true,
 *   defaultPaginationParams: { status: 'active' }
 * });
 *
 * // 在表格中使用
 * <Table
 *   dataSource={data}
 *   pagination={tablePaginationConfig}
 *   onChange={handleTableChange}
 *   loading={isLoading}
 * />
 * ```
 */
export function useEntityCRUD<T extends { id: ID }, C, U = Partial<C>>({
  api,
  queryKey,
  messages = {},
  customOperations = {},
  autoRefresh = false,
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  queryOptions = {},
  usePagination: enablePagination = false,
  defaultPaginationParams = {},
  resetPageOnFilterChange = true,
}: EntityCRUDConfig<T, C, U>): EntityCRUDResult<T, C, U> {
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];

  // 如果启用分页，使用分页Hook
  const {
    paginationParams,
    setPaginationParams,
    resetPagination,
    handleTableChange,
    tablePaginationConfig,
  } = usePagination({
    defaultFilters: defaultPaginationParams,
    resetPageOnFilterChange,
  });

  // 根据是否启用分页选择不同的查询方式
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: enablePagination
      ? [...queryKeyArray, paginationParams]
      : queryKeyArray,
    queryFn:
      enablePagination && api.getPaginated
        ? () => api.getPaginated!(paginationParams)
        : api.getAll,
    refetchInterval: autoRefresh ? refreshInterval : false,
    ...queryOptions,
  });

  // 处理查询结果
  const paginatedData =
    enablePagination && api.getPaginated
      ? (queryData as PaginatedResponse<T>)
      : undefined;

  const data =
    enablePagination && api.getPaginated
      ? paginatedData?.items
      : (queryData as T[] | undefined);

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

  // 构建返回结果
  const result: EntityCRUDResult<T, C, U> = {
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

  // 如果启用分页，添加分页相关属性
  if (enablePagination && api.getPaginated) {
    result.paginatedData = paginatedData;
    result.paginationParams = paginationParams;
    result.setPaginationParams = setPaginationParams;
    result.resetPagination = resetPagination;
    result.tablePaginationConfig = {
      ...tablePaginationConfig,
      total: paginatedData?.total || 0,
      current: paginatedData?.page || paginationParams.page,
      pageSize: paginatedData?.pageSize || paginationParams.pageSize,
    };
    result.handleTableChange = handleTableChange;
  }

  return result;
}
