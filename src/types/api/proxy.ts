/**
 * 代理相关类型定义
 */

// 代理状态
export type ProxyStatus = "online" | "offline";

// 创建代理DTO
export interface CreateProxyDto {
  id: string; // Note: ID is string for Proxy
  name: string;
  description?: string;
  apiKey?: string;
}

// 代理实体
export interface ProxyEntity {
  id: string;
  name: string;
  description: string | null;
  // apiKey omitted for security
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
  status: ProxyStatus; // default 'offline'
}

// 更新代理DTO
export interface UpdateProxyDto {
  id?: string; // Schema allows updating ID
  name?: string;
  description?: string;
  apiKey?: string;
}

// 代理连接DTO
export interface ProxyConnectionDto {
  proxyId: string;
  apiKey: string;
}
