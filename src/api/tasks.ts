import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  CreateTaskDto as CreateTaskDtoType,
  TaskEntity as TaskEntityType,
  UpdateTaskDto as UpdateTaskDtoType,
  PaginationParams as PaginationParamsType,
  TaskExecutionEntity as TaskExecutionEntityType,
} from "../types/api"; // Import global types

// Re-export types for use in components
export type TaskEntity = TaskEntityType;
export type CreateTaskDto = CreateTaskDtoType;
export type UpdateTaskDto = UpdateTaskDtoType;
export type TaskExecutionEntity = TaskExecutionEntityType;
export type PaginationParams = PaginationParamsType;
import { ID } from "../types/common"; // Import ID type

// Define specific pagination params for tasks including filters
export interface TaskPaginationParams extends PaginationParams {
  name?: string;
  command?: string;
}

// Define specific pagination params for task executions
export interface TaskExecutionPaginationParams extends PaginationParams {}

export const tasksApi = {
  // 获取任务列表（分页）
  getTasksPaginated: async (
    params: TaskPaginationParams = {}
  ): Promise<{
    // Use inline structure instead of PgResult
    items: TaskEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    // Use alias
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE, name, command } = params;
    // Filter out undefined values
    const queryParams = Object.fromEntries(
      Object.entries({ page, pageSize, name, command }).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );
    const response = await api.get("/tasks", { params: queryParams });
    return response.data;
  },

  // 获取所有任务（兼容旧版本，内部使用分页API）
  getAllTasks: async (): Promise<TaskEntity[]> => {
    try {
      // 使用分页API获取所有数据
      const response = await tasksApi.getTasksPaginated({
        page: 1,
        pageSize: 1000, // 假设最多1000个任务
      });
      return response.items;
    } catch (error) {
      console.error("获取所有任务失败:", error);
      throw error;
    }
  },

  // 获取单个任务
  getTask: async (id: ID): Promise<TaskEntity> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // 创建任务
  createTask: async (taskData: CreateTaskDto): Promise<TaskEntity> => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  // 更新任务
  updateTask: async (id: ID, taskData: UpdateTaskDto): Promise<TaskEntity> => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  // 删除任务
  deleteTask: async (id: ID): Promise<TaskEntity> => {
    // OpenAPI spec returns TaskEntity
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // 执行任务
  executeTask: async (id: ID): Promise<void> => {
    // OpenAPI: 200 "任务已添加到队列", likely no body
    await api.post(`/tasks/${id}/execute`);
    // No return needed for void
  },

  // 获取任务执行历史（分页）
  getTaskExecutionsPaginated: async (
    id: ID,
    params: TaskExecutionPaginationParams = {}
  ): Promise<{
    // Use inline structure instead of PgResult
    items: TaskExecutionEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    // Use alias
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
    const queryParams = { page, pageSize };
    const response = await api.get(`/tasks/${id}/executions`, {
      params: queryParams,
    });
    return response.data;
  },
};
