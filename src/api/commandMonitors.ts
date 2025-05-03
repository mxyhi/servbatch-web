import api from './axios';

export interface CreateCommandMonitorDto {
  name: string;
  description?: string;
  checkCommand: string;
  executeCommand: string;
  enabled?: boolean;
  serverId: number;
}

export interface CommandMonitorEntity {
  id: number;
  name: string;
  description?: string;
  checkCommand: string;
  executeCommand: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  serverId: number;
}

export interface UpdateCommandMonitorDto {
  name?: string;
  description?: string;
  checkCommand?: string;
  executeCommand?: string;
  enabled?: boolean;
  serverId?: number;
}

export interface CommandMonitorExecutionEntity {
  id: number;
  checkOutput?: string;
  checkExitCode: number;
  executed: boolean;
  executeOutput?: string;
  executeExitCode?: number;
  executedAt: string;
  monitorId: number;
  serverId: number;
}

export const commandMonitorsApi = {
  // 获取所有命令监控
  getAllCommandMonitors: async (): Promise<CommandMonitorEntity[]> => {
    const response = await api.get('/command-monitors');
    return response.data;
  },

  // 获取单个命令监控
  getCommandMonitor: async (id: number): Promise<CommandMonitorEntity> => {
    const response = await api.get(`/command-monitors/${id}`);
    return response.data;
  },

  // 创建命令监控
  createCommandMonitor: async (monitorData: CreateCommandMonitorDto): Promise<CommandMonitorEntity> => {
    const response = await api.post('/command-monitors', monitorData);
    return response.data;
  },

  // 更新命令监控
  updateCommandMonitor: async (id: number, monitorData: UpdateCommandMonitorDto): Promise<CommandMonitorEntity> => {
    const response = await api.patch(`/command-monitors/${id}`, monitorData);
    return response.data;
  },

  // 删除命令监控
  deleteCommandMonitor: async (id: number): Promise<CommandMonitorEntity> => {
    const response = await api.delete(`/command-monitors/${id}`);
    return response.data;
  },

  // 启用命令监控
  enableCommandMonitor: async (id: number): Promise<CommandMonitorEntity> => {
    const response = await api.post(`/command-monitors/${id}/enable`);
    return response.data;
  },

  // 禁用命令监控
  disableCommandMonitor: async (id: number): Promise<CommandMonitorEntity> => {
    const response = await api.post(`/command-monitors/${id}/disable`);
    return response.data;
  },

  // 获取命令监控执行历史
  getCommandMonitorExecutions: async (id: number, limit?: number): Promise<CommandMonitorExecutionEntity[]> => {
    const url = limit 
      ? `/command-monitors/${id}/executions?limit=${limit}` 
      : `/command-monitors/${id}/executions`;
    const response = await api.get(url);
    return response.data;
  },
};
