import api from './axios';

export interface CreateTaskDto {
  name: string;
  description?: string;
  command: string;
  timeout?: number;
}

export interface TaskEntity {
  id: number;
  name: string;
  description?: string;
  command: string;
  timeout?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  command?: string;
  timeout?: number;
}

export const tasksApi = {
  // 获取所有任务
  getAllTasks: async (): Promise<TaskEntity[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // 获取单个任务
  getTask: async (id: number): Promise<TaskEntity> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // 创建任务
  createTask: async (taskData: CreateTaskDto): Promise<TaskEntity> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // 更新任务
  updateTask: async (id: number, taskData: UpdateTaskDto): Promise<TaskEntity> => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  // 删除任务
  deleteTask: async (id: number): Promise<TaskEntity> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // 执行任务
  executeTask: async (id: number): Promise<any> => {
    const response = await api.post(`/tasks/${id}/execute`);
    return response.data;
  },

  // 获取任务执行历史
  getTaskExecutions: async (id: number): Promise<any> => {
    const response = await api.get(`/tasks/${id}/executions`);
    return response.data;
  },
};
