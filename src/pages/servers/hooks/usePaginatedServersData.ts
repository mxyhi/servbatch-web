import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd/es/table';
import { serversApi } from '../../../api/servers';
import { DEFAULT_PAGE_SIZE } from '../../../constants';
import { ServerEntity, ServerStatus, ServerConnectionType } from '../../../types/api';
import usePagination from '../../../hooks/usePagination';

/**
 * 分页获取服务器数据的Hook
 * 
 * @param defaultFilters 默认过滤条件
 * @returns 分页数据和操作方法
 */
export const usePaginatedServersData = (defaultFilters: {
  name?: string;
  host?: string;
  status?: ServerStatus;
  connectionType?: ServerConnectionType;
} = {}) => {
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
    queryKey: ['servers', 'paginated', paginationParams],
    queryFn: () => serversApi.getServersPaginated(paginationParams),
  });

  // 提取服务器列表
  const servers = paginatedData?.items || [];

  // 构建表格分页配置
  const pagination: TablePaginationConfig = {
    ...tablePaginationConfig,
    total: paginatedData?.total || 0,
    current: paginatedData?.page || paginationParams.page,
    pageSize: paginatedData?.pageSize || paginationParams.pageSize,
  };

  return {
    servers,
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

export default usePaginatedServersData;
