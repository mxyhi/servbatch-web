import api from "./axios";
// Import necessary types from the global definitions
import {
  SystemSummary as SystemSummaryType,
  SystemSummaryWithProxies as SystemSummaryWithProxiesType,
  TaskExecutionEntity as TaskExecutionEntityType,
  ServerStatusInfo as ServerStatusInfoType, // Renamed in global types
  ProxyStatusInfo as ProxyStatusInfoType, // Renamed in global types
  TaskStats as TaskStatsType,
} from "../types/api";

// Re-export types for use in components
export type SystemSummary = SystemSummaryType;
export type SystemSummaryWithProxies = SystemSummaryWithProxiesType;
export type TaskExecutionEntity = TaskExecutionEntityType;
export type ServerStatusInfo = ServerStatusInfoType;
export type ProxyStatusInfo = ProxyStatusInfoType;
export type TaskStats = TaskStatsType;

export const dashboardApi = {
  // 获取系统摘要
  getSummary: async (): Promise<SystemSummary> => {
    const response = await api.get("/dashboard/summary");
    // Assuming response.data matches the SystemSummary structure from OpenAPI
    return response.data;
  },

  // 获取包含代理信息的系统摘要
  getSummaryWithProxies: async (): Promise<SystemSummaryWithProxies> => {
    const response = await api.get("/dashboard/summary-with-proxies");
    // Assuming response.data matches the SystemSummaryWithProxies structure
    return response.data;
  },

  // 获取最近的执行记录
  getRecentExecutions: async (
    limit?: number
  ): Promise<TaskExecutionEntity[]> => {
    // Return type confirmed from OpenAPI
    const url = limit
      ? `/dashboard/recent-executions?limit=${limit}`
      : "/dashboard/recent-executions";
    const response = await api.get(url);
    return response.data;
  },

  // 获取所有服务器状态
  getServerStatus: async (): Promise<ServerStatusInfo[]> => {
    // Use ServerStatusInfo
    const response = await api.get("/dashboard/server-status");
    // Assuming response.data is an array matching ServerStatusInfo
    return response.data;
  },

  // 获取所有代理状态
  getProxyStatus: async (): Promise<ProxyStatusInfo[]> => {
    // Use ProxyStatusInfo
    const response = await api.get("/dashboard/proxy-status");
    // Assuming response.data is an array matching ProxyStatusInfo
    return response.data;
  },

  // 获取任务统计信息
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await api.get("/dashboard/task-stats");
    // Assuming response.data matches the TaskStats structure
    return response.data;
  },
};
