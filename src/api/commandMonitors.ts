import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  CreateCommandMonitorDto as CreateCommandMonitorDtoType,
  CommandMonitorEntity as CommandMonitorEntityType,
  UpdateCommandMonitorDto as UpdateCommandMonitorDtoType,
  CommandMonitorExecutionEntity as CommandMonitorExecutionEntityType,
  CleanupByDateDto as CleanupByDateDtoType,
  CleanupResultDto as CleanupResultDtoType,
  PaginationParams as PaginationParamsType,
} from "../types/api"; // Import global types

// Re-export types for use in components
export type CreateCommandMonitorDto = CreateCommandMonitorDtoType;
export type CommandMonitorEntity = CommandMonitorEntityType;
export type UpdateCommandMonitorDto = UpdateCommandMonitorDtoType;
export type CommandMonitorExecutionEntity = CommandMonitorExecutionEntityType;
export type CleanupByDateDto = CleanupByDateDtoType;
export type CleanupResultDto = CleanupResultDtoType;
export type PaginationParams = PaginationParamsType;
import { ID } from "../types/common"; // Import ID type

// Define specific pagination params for command monitors including filters
export interface CommandMonitorPaginationParams extends PaginationParams {
  name?: string;
  enabled?: boolean;
  serverId?: ID;
}

// Define specific pagination params for command monitor executions
export interface CommandMonitorExecutionPaginationParams
  extends PaginationParams {}

export const commandMonitorsApi = {
  // 获取命令监控列表（分页）
  getCommandMonitorsPaginated: async (
    params: CommandMonitorPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: CommandMonitorEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      name,
      enabled,
      serverId,
    } = params;
    // Filter out undefined values
    const queryParams = Object.fromEntries(
      Object.entries({ page, pageSize, name, enabled, serverId }).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );
    const response = await api.get("/command-monitors", {
      params: queryParams,
    });
    return response.data;
  },

  // 获取单个命令监控
  getCommandMonitor: async (id: ID): Promise<CommandMonitorEntity> => {
    const response = await api.get(`/command-monitors/${id}`);
    return response.data;
  },

  // 创建命令监控
  createCommandMonitor: async (
    monitorData: CreateCommandMonitorDto
  ): Promise<CommandMonitorEntity> => {
    const response = await api.post("/command-monitors", monitorData);
    return response.data;
  },

  // 更新命令监控
  updateCommandMonitor: async (
    id: ID,
    monitorData: UpdateCommandMonitorDto
  ): Promise<CommandMonitorEntity> => {
    const response = await api.patch(`/command-monitors/${id}`, monitorData);
    return response.data;
  },

  // 删除命令监控
  deleteCommandMonitor: async (id: ID): Promise<CommandMonitorEntity> => {
    // OpenAPI spec returns CommandMonitorEntity
    const response = await api.delete(`/command-monitors/${id}`);
    return response.data;
  },

  // 启用命令监控
  enableCommandMonitor: async (id: ID): Promise<CommandMonitorEntity> => {
    const response = await api.post(`/command-monitors/${id}/enable`);
    return response.data;
  },

  // 禁用命令监控
  disableCommandMonitor: async (id: ID): Promise<CommandMonitorEntity> => {
    const response = await api.post(`/command-monitors/${id}/disable`);
    return response.data;
  },

  // 获取命令监控执行历史（分页）
  getCommandMonitorExecutionsPaginated: async (
    id: ID,
    params: CommandMonitorExecutionPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: CommandMonitorExecutionEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
    const queryParams = { page, pageSize };
    const response = await api.get(`/command-monitors/${id}/executions`, {
      params: queryParams,
    });
    return response.data;
  },

  // 清理指定命令监控的所有执行历史
  cleanupExecutionsByMonitorId: async (id: ID): Promise<CleanupResultDto> => {
    const response = await api.delete(`/command-monitors/${id}/executions`);
    return response.data;
  },

  // 根据日期范围清理命令监控执行历史
  cleanupExecutionsByDate: async (
    id: ID,
    cleanupData: CleanupByDateDto
  ): Promise<CleanupResultDto> => {
    const response = await api.post(
      `/command-monitors/${id}/executions/cleanup`,
      cleanupData
    );
    return response.data;
  },

  // 清理指定服务器的所有命令监控执行历史
  cleanupExecutionsByServerId: async (
    serverId: ID
  ): Promise<CleanupResultDto> => {
    const response = await api.delete(
      `/command-monitors/executions/server/${serverId}`
    );
    return response.data;
  },
};
