import { useState, useCallback } from 'react';
import { TablePaginationConfig } from 'antd/es/table';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { PaginationParams } from '../types/common';

/**
 * 分页参数接口，扩展自基础分页参数
 * 可以添加额外的过滤条件
 */
export interface ExtendedPaginationParams extends PaginationParams {
  [key: string]: any;
}

/**
 * 分页Hook配置接口
 */
export interface UsePaginationConfig {
  /** 默认页码 */
  defaultPage?: number;
  /** 默认每页数量 */
  defaultPageSize?: number;
  /** 默认过滤条件 */
  defaultFilters?: Record<string, any>;
  /** 是否在参数变化时自动重置到第一页 */
  resetPageOnFilterChange?: boolean;
}

/**
 * 分页Hook返回值接口
 */
export interface UsePaginationResult {
  /** 当前分页参数 */
  paginationParams: ExtendedPaginationParams;
  /** 设置分页参数 */
  setPaginationParams: (params: Partial<ExtendedPaginationParams>) => void;
  /** 重置分页参数到默认值 */
  resetPagination: () => void;
  /** 处理表格分页变化 */
  handleTableChange: (pagination: TablePaginationConfig, filters?: Record<string, any>, sorter?: any) => void;
  /** 表格分页配置 */
  tablePaginationConfig: TablePaginationConfig;
}

/**
 * 通用分页Hook
 * 
 * 提供分页状态管理、分页变化处理、过滤条件管理等功能
 * 
 * @param config Hook配置
 * @returns 分页状态和操作方法
 * 
 * @example
 * ```tsx
 * const {
 *   paginationParams,
 *   setPaginationParams,
 *   resetPagination,
 *   handleTableChange,
 *   tablePaginationConfig
 * } = usePagination({
 *   defaultFilters: { status: 'active' }
 * });
 * 
 * // 在查询中使用
 * const { data } = useQuery(['users', paginationParams], 
 *   () => usersApi.getUsersPaginated(paginationParams)
 * );
 * 
 * // 在表格中使用
 * <Table 
 *   dataSource={data?.items} 
 *   pagination={tablePaginationConfig}
 *   onChange={handleTableChange}
 * />
 * ```
 */
export function usePagination({
  defaultPage = 1,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultFilters = {},
  resetPageOnFilterChange = true
}: UsePaginationConfig = {}): UsePaginationResult {
  // 合并默认分页参数和过滤条件
  const defaultParams: ExtendedPaginationParams = {
    page: defaultPage,
    pageSize: defaultPageSize,
    ...defaultFilters
  };

  // 分页状态
  const [paginationParams, setPaginationParamsState] = useState<ExtendedPaginationParams>(defaultParams);

  // 设置分页参数
  const setPaginationParams = useCallback((params: Partial<ExtendedPaginationParams>) => {
    setPaginationParamsState(prev => {
      // 如果有过滤条件变化且需要重置页码，则重置到第一页
      if (resetPageOnFilterChange && 
          Object.keys(params).some(key => key !== 'page' && key !== 'pageSize')) {
        return { ...prev, ...params, page: 1 };
      }
      return { ...prev, ...params };
    });
  }, [resetPageOnFilterChange]);

  // 重置分页参数
  const resetPagination = useCallback(() => {
    setPaginationParamsState(defaultParams);
  }, [defaultParams]);

  // 处理表格分页变化
  const handleTableChange = useCallback((
    pagination: TablePaginationConfig,
    filters?: Record<string, any>,
    sorter?: any
  ) => {
    const newParams: Partial<ExtendedPaginationParams> = {};
    
    // 处理分页变化
    if (pagination) {
      if (pagination.current) {
        newParams.page = pagination.current;
      }
      if (pagination.pageSize) {
        newParams.pageSize = pagination.pageSize;
      }
    }
    
    // 处理过滤条件变化
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        // 只添加有值的过滤条件
        if (value !== undefined && value !== null) {
          newParams[key] = Array.isArray(value) && value.length === 1 ? value[0] : value;
        }
      });
    }
    
    // 处理排序变化
    if (sorter && 'field' in sorter && 'order' in sorter) {
      newParams.sortField = sorter.field;
      newParams.sortOrder = sorter.order;
    }
    
    setPaginationParams(newParams);
  }, [setPaginationParams]);

  // 构建表格分页配置
  const tablePaginationConfig: TablePaginationConfig = {
    current: paginationParams.page,
    pageSize: paginationParams.pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
  };

  return {
    paginationParams,
    setPaginationParams,
    resetPagination,
    handleTableChange,
    tablePaginationConfig
  };
}

export default usePagination;
