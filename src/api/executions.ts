import api from "./axios";

export interface CreateTaskExecutionDto {
  taskId: number;
  serverIds: number[];
  priority: number;
}

export interface TaskExecutionEntity {
  id: number;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  output?: string;
  exitCode?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  taskId: number;
  serverId: number;
}

export interface CleanupByDateDto {
  startDate: string;
  endDate: string;
}

export interface CleanupByStatusDto {
  statuses: ("queued" | "running" | "completed" | "failed" | "cancelled")[];
}

export interface CleanupResultDto {
  deletedCount: number;
  success: boolean;
  message?: string;
}

export const executionsApi = {
  // 获取所有执行记录
  getAllExecutions: async (): Promise<TaskExecutionEntity[]> => {
    const response = await api.get("/executions");
    return response.data;
  },

  // 获取单个执行记录
  getExecution: async (id: number): Promise<TaskExecutionEntity> => {
    const response = await api.get(`/executions/${id}`);
    return response.data;
  },

  // 创建执行记录
  createExecution: async (
    executionData: CreateTaskExecutionDto
  ): Promise<any> => {
    const response = await api.post("/executions", executionData);
    return response.data;
  },

  // 删除执行记录
  deleteExecution: async (id: number): Promise<TaskExecutionEntity> => {
    const response = await api.delete(`/executions/${id}`);
    return response.data;
  },

  // 获取指定任务的所有执行记录
  getExecutionsByTaskId: async (
    taskId: number
  ): Promise<TaskExecutionEntity[]> => {
    const response = await api.get(`/executions/task/${taskId}`);
    return response.data;
  },

  // 获取指定服务器的所有执行记录
  getExecutionsByServerId: async (
    serverId: number
  ): Promise<TaskExecutionEntity[]> => {
    const response = await api.get(`/executions/server/${serverId}`);
    return response.data;
  },

  // 取消执行中的任务
  cancelExecution: async (id: number): Promise<TaskExecutionEntity> => {
    const response = await api.post(`/executions/${id}/cancel`);
    return response.data;
  },

  // 根据日期范围清理执行历史记录
  cleanupByDate: async (
    cleanupData: CleanupByDateDto
  ): Promise<CleanupResultDto> => {
    const response = await api.post("/executions/cleanup/by-date", cleanupData);
    return response.data;
  },

  // 根据状态清理执行历史记录
  cleanupByStatus: async (
    cleanupData: CleanupByStatusDto
  ): Promise<CleanupResultDto> => {
    const response = await api.post(
      "/executions/cleanup/by-status",
      cleanupData
    );
    return response.data;
  },

  // 清理指定任务的所有执行历史记录
  cleanupByTaskId: async (taskId: number): Promise<CleanupResultDto> => {
    const response = await api.delete(`/executions/cleanup/task/${taskId}`);
    return response.data;
  },

  // 清理指定服务器的所有执行历史记录
  cleanupByServerId: async (serverId: number): Promise<CleanupResultDto> => {
    const response = await api.delete(`/executions/cleanup/server/${serverId}`);
    return response.data;
  },
};
