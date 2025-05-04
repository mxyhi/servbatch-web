import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd/es/table';
import { commandMonitorsApi } from '../../../api/commandMonitors';
import { DEFAULT_PAGE_SIZE } from '../../../constants';
import { CommandMonitorEntity } from '../../../types/api';
import usePagination from '../../../hooks/usePagination';

/**
 * 分页获取命令监控的Hook
 * 
 * @param defaultFilters 默认过滤条件
 * @returns 分页数据和操作方法
 */
export const usePaginatedMonitors = (defaultFilters: Record<string, any> = {}) => {
  // 使用通用分页Hook
  const {
    paginationParams,
    setPaginationParams,
    resetPagination,
    handleTableChange,
    tablePaginationConfig
  } = usePagination({
    defaultFilters: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...defaultFilters
    }
  });

  // 获取分页数据
  const {
    data: paginatedData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['commandMonitors', 'paginated', paginationParams],
    queryFn: () => commandMonitorsApi.getCommandMonitorsPaginated(paginationParams),
  });

  // 提取监控列表
  const monitors = paginatedData?.items || [];

  // 构建表格分页配置
  const pagination: TablePaginationConfig = {
    ...tablePaginationConfig,
    total: paginatedData?.total || 0,
    current: paginatedData?.page || paginationParams.page,
    pageSize: paginatedData?.pageSize || paginationParams.pageSize,
  };

  return {
    monitors,
    paginatedData,
    isLoading,
    refetch,
    paginationParams,
    setPaginationParams,
    resetPagination,
    pagination,
    handleTableChange
  };
};

export default usePaginatedMonitors;
