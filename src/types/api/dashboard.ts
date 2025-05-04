/**
 * 仪表盘相关类型定义
 */
import { ID } from "../common";
import { ServerStatus } from "./server";
import { ProxyStatus } from "./proxy";

// 系统摘要
export interface SystemSummary {
  totalServers: number;
  onlineServers: number;
  offlineServers: number;
  unknownServers: number;
  totalTasks: number;
  totalExecutions: number;
  runningExecutions: number;
  queuedExecutions: number;
}

// 带代理的系统摘要
export interface SystemSummaryWithProxies extends SystemSummary {
  totalProxies: number;
  onlineProxies: number;
}

// 服务器状态信息
export interface ServerStatusInfo {
  id: ID;
  name: string;
  status: ServerStatus;
}

// 任务统计
export interface TaskStats {
  totalTasks: number;
  // Add more specific stats if defined by the endpoint logic
}

// 代理状态信息
export interface ProxyStatusInfo {
  id: string; // Proxy ID is string
  name: string;
  status: ProxyStatus;
}
