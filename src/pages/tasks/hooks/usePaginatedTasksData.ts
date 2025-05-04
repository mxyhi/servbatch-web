import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../../../api/tasks';
import { DEFAULT_PAGE_SIZE } from '../../../constants';
import { TaskEntity } from '../../../types/api';

/**
 * 分页获取任务数据的Hook
 * 
 * @param defaultFilters 默认过滤条件
 * @returns 任务数据
 */
export const usePaginatedTasksData = (defaultFilters: Record<string, any> = {}) => {
  // 获取分页数据
  const {
    data: paginatedData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['tasks', 'paginated', { 
      page: 1, 
      pageSize: DEFAULT_PAGE_SIZE,
      ...defaultFilters 
    }],
    queryFn: () => tasksApi.getTasksPaginated({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...defaultFilters
    }),
  });

  // 提取任务列表
  const tasks = paginatedData?.items || [];

  return {
    tasks,
    paginatedData,
    isLoading,
    refetch
  };
};

export default usePaginatedTasksData;
