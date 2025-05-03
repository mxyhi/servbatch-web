import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/dashboard";

/**
 * 处理仪表盘数据获取的自定义Hook
 */
export const useDashboardData = () => {
  // 获取系统摘要
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummaryWithProxies,
  });

  // 获取服务器状态
  const { data: serverStatus, isLoading: serverStatusLoading } = useQuery({
    queryKey: ["dashboard", "serverStatus"],
    queryFn: dashboardApi.getServerStatus,
  });

  // 获取任务统计
  const { data: taskStats, isLoading: taskStatsLoading } = useQuery({
    queryKey: ["dashboard", "taskStats"],
    queryFn: dashboardApi.getTaskStats,
  });

  // 获取代理状态
  const { data: proxyStatus, isLoading: proxyStatusLoading } = useQuery({
    queryKey: ["dashboard", "proxyStatus"],
    queryFn: dashboardApi.getProxyStatus,
  });

  // 判断是否正在加载
  const isLoading =
    summaryLoading || serverStatusLoading || taskStatsLoading || proxyStatusLoading;

  return {
    summary,
    serverStatus,
    taskStats,
    proxyStatus,
    isLoading,
  };
};
