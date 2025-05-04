import { useQuery } from "@tanstack/react-query";
import { serversApi } from "../../../api/servers";
import { DEFAULT_PAGE_SIZE } from "../../../constants";

/**
 * 分页获取服务器的Hook
 *
 * @param defaultFilters 默认过滤条件
 * @returns 服务器数据
 */
export const usePaginatedServers = (
  defaultFilters: Record<string, any> = {}
) => {
  // 获取分页数据
  const {
    data: paginatedData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "servers",
      "paginated",
      {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        ...defaultFilters,
      },
    ],
    queryFn: () =>
      serversApi.getServersPaginated({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        ...defaultFilters,
      }),
  });

  // 提取服务器列表
  const servers = paginatedData?.items || [];

  return {
    servers,
    paginatedData,
    isLoading,
    refetch,
  };
};

export default usePaginatedServers;
