import api from './axios';

export interface CreateTaskExecutionDto {
  taskId: number;
  serverIds: number[];
  priority: number;
}

export interface TaskExecutionEntity {
  id: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  output?: string;
  exitCode?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  taskId: number;
  serverId: number;
}

export const executionsApi = {
  // 获取所有执行记录
  getAllExecutions: async (): Promise<TaskExecutionEntity[]> => {
    const response = await api.get('/executions');
    return response.data;
  },

  // 获取单个执行记录
  getExecution: async (id: number): Promise<TaskExecutionEntity> => {
    const response = await api.get(`/executions/${id}`);
    return response.data;
  },

  // 创建执行记录
  createExecution: async (executionData: CreateTaskExecutionDto): Promise<any> => {
    const response = await api.post('/executions', executionData);
    return response.data;
  },

  // 删除执行记录
  deleteExecution: async (id: number): Promise<TaskExecutionEntity> => {
    const response = await api.delete(`/executions/${id}`);
    return response.data;
  },

  // 获取指定任务的所有执行记录
  getExecutionsByTaskId: async (taskId: number): Promise<TaskExecutionEntity[]> => {
    const response = await api.get(`/executions/task/${taskId}`);
    return response.data;
  },

  // 获取指定服务器的所有执行记录
  getExecutionsByServerId: async (serverId: number): Promise<TaskExecutionEntity[]> => {
    const response = await api.get(`/executions/server/${serverId}`);
    return response.data;
  },

  // 取消执行中的任务
  cancelExecution: async (id: number): Promise<TaskExecutionEntity> => {
    const response = await api.post(`/executions/${id}/cancel`);
    return response.data;
  },
};
