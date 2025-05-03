import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";

export interface CreateServerDto {
  name: string;
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  connectionType?: "direct" | "proxy";
  proxyId?: string;
}

export interface ServerEntity {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  status: "online" | "offline" | "unknown";
  lastChecked?: Date;
  createdAt: string;
  updatedAt: string;
  connectionType: "direct" | "proxy";
  proxyId?: string;
  privateKey?: string;
}

export interface UpdateServerDto {
  name?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: string;
  connectionType?: "direct" | "proxy";
  proxyId?: string;
}

export interface ImportServersDto {
  servers: CreateServerDto[];
}

export interface ImportFailureServerDto {
  server: CreateServerDto;
  reason: string;
}

export interface ImportServersResultDto {
  successCount: number;
  failureCount: number;
  successServers: ServerEntity[];
  failureServers: ImportFailureServerDto[];
}

// 分页参数接口
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 分页结果接口
export interface PaginationResultDto<T> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}

// 服务器分页结果接口
export interface ServerPaginationResult
  extends PaginationResultDto<ServerEntity> {}

export const serversApi = {
  // 获取服务器列表（分页）
  getServersPaginated: async (
    params: PaginationParams = {}
  ): Promise<ServerPaginationResult> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
    const response = await api.get("/servers", {
      params: { page, pageSize },
    });
    return response.data;
  },

  // 获取所有服务器（兼容旧版本，内部使用分页API）
  getAllServers: async (): Promise<ServerEntity[]> => {
    try {
      // 尝试使用分页API获取所有数据
      const response = await serversApi.getServersPaginated({
        page: 1,
        pageSize: 1000, // 使用较大的页面大小，假设不会超过1000个服务器
      });
      return response.items;
    } catch (error) {
      // 如果分页API失败，回退到旧版API
      const response = await api.get("/servers");
      return response.data;
    }
  },

  // 获取单个服务器
  getServer: async (id: number): Promise<ServerEntity> => {
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
    id: number,
    serverData: UpdateServerDto
  ): Promise<ServerEntity> => {
    const response = await api.patch(`/servers/${id}`, serverData);
    return response.data;
  },

  // 删除服务器
  deleteServer: async (id: number): Promise<ServerEntity> => {
    const response = await api.delete(`/servers/${id}`);
    return response.data;
  },

  // 测试服务器连接
  testConnection: async (id: number): Promise<any> => {
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
};
