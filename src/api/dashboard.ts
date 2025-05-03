import api from './axios';
import { TaskExecutionEntity } from './executions';

export interface SystemSummary {
  totalServers: number;
  onlineServers: number;
  totalTasks: number;
  executionsToday: number;
  successRate: number;
}

export interface ServerStatus {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'unknown';
  lastChecked?: string;
}

export interface TaskStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  mostExecutedTasks: {
    taskId: number;
    taskName: string;
    executionCount: number;
  }[];
}

export const dashboardApi = {
  // 获取系统摘要
  getSummary: async (): Promise<SystemSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  // 获取最近的执行记录
  getRecentExecutions: async (limit?: number): Promise<TaskExecutionEntity[]> => {
    const url = limit ? `/dashboard/recent-executions?limit=${limit}` : '/dashboard/recent-executions';
    const response = await api.get(url);
    return response.data;
  },

  // 获取所有服务器状态
  getServerStatus: async (): Promise<ServerStatus[]> => {
    const response = await api.get('/dashboard/server-status');
    return response.data;
  },

  // 获取任务统计信息
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await api.get('/dashboard/task-stats');
    return response.data;
  },
};
