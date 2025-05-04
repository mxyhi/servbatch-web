import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  CreateTaskExecutionDto as CreateTaskExecutionDtoType,
  TaskExecutionEntity as TaskExecutionEntityType,
  CleanupByDateDto as CleanupByDateDtoType,
  CleanupByStatusDto as CleanupByStatusDtoType,
  CleanupResultDto as CleanupResultDtoType,
  PaginationParams as PaginationParamsType,
  // ExecutionStatus is already defined globally, no need for local enum array
} from "../types/api"; // Import global types

// Re-export types for use in components
export type TaskExecutionEntity = TaskExecutionEntityType;
export type CreateTaskExecutionDto = CreateTaskExecutionDtoType;
export type CleanupByDateDto = CleanupByDateDtoType;
export type CleanupByStatusDto = CleanupByStatusDtoType;
export type CleanupResultDto = CleanupResultDtoType;
export type PaginationParams = PaginationParamsType;
import { ID } from "../types/common"; // Import ID type

// Define specific pagination params for executions
export interface ExecutionPaginationParams extends PaginationParams {}

export const executionsApi = {
  // 获取执行记录列表（分页）
  getExecutionsPaginated: async (
    params: ExecutionPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: TaskExecutionEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
    const queryParams = { page, pageSize };
    const response = await api.get("/executions", { params: queryParams });
    return response.data;
  },

  // 获取单个执行记录
  getExecution: async (id: ID): Promise<TaskExecutionEntity> => {
    const response = await api.get(`/executions/${id}`);
    return response.data;
  },

  // 创建执行记录
  createExecution: async (
    executionData: CreateTaskExecutionDto
  ): Promise<void> => {
    // OpenAPI: 201 "任务已添加到队列", likely no body
    await api.post("/executions", executionData);
    // No return needed for void
  },

  // 删除执行记录
  deleteExecution: async (id: ID): Promise<TaskExecutionEntity> => {
    // OpenAPI spec returns TaskExecutionEntity
    const response = await api.delete(`/executions/${id}`);
    return response.data;
  },

  // 获取指定任务的执行记录（分页）
  getExecutionsByTaskIdPaginated: async (
    taskId: ID,
    params: ExecutionPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: TaskExecutionEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
    const queryParams = { page, pageSize };
    const response = await api.get(`/executions/task/${taskId}`, {
      params: queryParams,
    });
    return response.data;
  },

  // 获取指定服务器的执行记录（分页）
  getExecutionsByServerIdPaginated: async (
    serverId: ID,
    params: ExecutionPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: TaskExecutionEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
    const queryParams = { page, pageSize };
    const response = await api.get(`/executions/server/${serverId}`, {
      params: queryParams,
    });
    return response.data;
  },

  // 取消执行中的任务
  cancelExecution: async (id: ID): Promise<TaskExecutionEntity> => {
    // OpenAPI spec returns TaskExecutionEntity
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
    cleanupData: CleanupByStatusDto // Uses global ExecutionStatus[] type now
  ): Promise<CleanupResultDto> => {
    const response = await api.post(
      "/executions/cleanup/by-status",
      cleanupData
    );
    return response.data;
  },

  // 清理指定任务的所有执行历史记录
  cleanupByTaskId: async (taskId: ID): Promise<CleanupResultDto> => {
    const response = await api.delete(`/executions/cleanup/task/${taskId}`);
    return response.data;
  },

  // 清理指定服务器的所有执行历史记录
  cleanupByServerId: async (serverId: ID): Promise<CleanupResultDto> => {
    const response = await api.delete(`/executions/cleanup/server/${serverId}`);
    return response.data;
  },
};
