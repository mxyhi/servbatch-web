import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  CreateServerDto as CreateServerDtoType,
  ServerEntity as ServerEntityType,
  UpdateServerDto as UpdateServerDtoType,
  ImportServersDto as ImportServersDtoType,
  ImportServersResultDto as ImportServersResultDtoType,
  PaginationParams as PaginationParamsType,
  ServerStatus,
  ServerConnectionType,
  ServerDetails as ServerDetailsType,
  ServerResources as ServerResourcesType,
  ExecuteCommandRequest as ExecuteCommandRequestType,
  ExecuteCommandResponse as ExecuteCommandResponseType,
  TerminalSession as TerminalSessionType,
} from "../types/api"; // Import global types

// Re-export types for use in components
export type ServerEntity = ServerEntityType;
export type CreateServerDto = CreateServerDtoType;
export type UpdateServerDto = UpdateServerDtoType;
export type ImportServersDto = ImportServersDtoType;
export type ImportServersResultDto = ImportServersResultDtoType;
export type PaginationParams = PaginationParamsType;
export type ServerDetails = ServerDetailsType;
export type ServerResources = ServerResourcesType;
export type ExecuteCommandRequest = ExecuteCommandRequestType;
export type ExecuteCommandResponse = ExecuteCommandResponseType;
export type TerminalSession = TerminalSessionType;
import { ID } from "../types/common"; // Import ID type

// Define specific pagination params for servers including filters
export interface ServerPaginationParams extends PaginationParams {
  name?: string;
  host?: string;
  status?: ServerStatus;
  connectionType?: ServerConnectionType;
  search?: string;
}

export const serversApi = {
  // 获取服务器列表（分页）
  getServersPaginated: async (
    params: ServerPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: ServerEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    // Destructure all possible params, providing defaults for pagination
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      name,
      host,
      status,
      connectionType,
    } = params;
    // Filter out undefined values before sending
    const queryParams = Object.fromEntries(
      Object.entries({
        page,
        pageSize,
        name,
        host,
        status,
        connectionType,
      }).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const response = await api.get("/servers", {
      params: queryParams,
    });
    // Assuming the backend response matches PaginationResult structure
    return response.data;
  },

  // 获取所有服务器（兼容旧版本，内部使用分页API）
  // Consider refactoring components to use getServersPaginated directly
  getAllServers: async (): Promise<ServerEntity[]> => {
    try {
      // 使用默认页面大小，避免请求过大的数据量
      const response = await serversApi.getServersPaginated({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE, // 使用默认页面大小
      });
      return response.items;
    } catch (error) {
      console.error(
        "Failed to fetch all servers using pagination, falling back to old method if available or handle error:",
        error
      );
      // 返回空数组，避免错误传播
      return [];
    }
  },

  // 获取单个服务器
  getServer: async (id: ID): Promise<ServerEntity> => {
    const response = await api.get(`/servers/${id}`);
    return response.data;
  },

  // 创建服务器
  createServer: async (serverData: CreateServerDto): Promise<ServerEntity> => {
    const response = await api.post("/servers", serverData);
    return response.data;
  },

  // 更新服务器
  updateServer: async (
    id: ID,
    serverData: UpdateServerDto
  ): Promise<ServerEntity> => {
    const response = await api.patch(`/servers/${id}`, serverData);
    return response.data;
  },

  // 删除服务器
  deleteServer: async (id: ID): Promise<ServerEntity> => {
    // OpenAPI spec returns ServerEntity
    const response = await api.delete(`/servers/${id}`);
    return response.data;
  },

  // 测试服务器连接
  testConnection: async (id: ID): Promise<any> => {
    // Response schema not defined in OpenAPI
    const response = await api.post(`/servers/${id}/test`);
    return response.data;
  },

  // 批量导入服务器
  importServers: async (
    importData: ImportServersDto
  ): Promise<ImportServersResultDto> => {
    const response = await api.post("/servers/import", importData);
    return response.data;
  },

  // 获取服务器列表（分页搜索）
  getServersPaginatedSearch: async (
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
    } = {}
  ): Promise<{
    items: ServerEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = 10, search } = params;
    // Filter out undefined values before sending
    const queryParams = Object.fromEntries(
      Object.entries({
        page,
        pageSize,
        search,
      }).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    // 使用现有的getServersPaginated API，但添加search参数
    // 实际项目中可能需要创建新的后端API端点
    const response = await api.get("/servers", {
      params: queryParams,
    });
    return response.data;
  },

  // 获取服务器详情
  getServerDetails: async (id: ID): Promise<ServerDetails> => {
    const response = await api.get(`/servers/${id}/details`);
    return response.data;
  },

  // 获取服务器资源使用情况
  getServerResources: async (id: ID): Promise<ServerResources> => {
    const response = await api.get(`/servers/${id}/resources`);
    return response.data;
  },

  // 在服务器上执行命令
  executeCommand: async (
    id: ID,
    commandData: ExecuteCommandRequest
  ): Promise<ExecuteCommandResponse> => {
    const response = await api.post(`/servers/${id}/execute`, commandData);
    return response.data;
  },

  // 创建终端会话
  createTerminalSession: async (id: ID): Promise<TerminalSession> => {
    const response = await api.post(`/servers/${id}/terminal/session`);
    return response.data;
  },

  // 关闭终端会话
  closeTerminalSession: async (
    id: ID,
    sessionId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(
      `/servers/${id}/terminal/session/${sessionId}`
    );
    return response.data;
  },
};
