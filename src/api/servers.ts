import api from "./axios";

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

export const serversApi = {
  // 获取所有服务器
  getAllServers: async (): Promise<ServerEntity[]> => {
    const response = await api.get("/servers");
    return response.data;
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
