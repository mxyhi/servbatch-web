import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  CreateProxyDto,
  ProxyEntity,
  UpdateProxyDto,
  PaginationParams,
  // ProxyStatus is defined globally
} from "../types/api"; // Import global types
// Note: Proxy ID is string, so no need to import ID from common

// Define specific pagination params for proxies including filters
export interface ProxyPaginationParams extends PaginationParams {
  id?: string; // Filter by exact ID
  name?: string; // Filter by name (fuzzy match)
}

export const proxiesApi = {
  // 获取代理列表（分页）
  getProxiesPaginated: async (
    params: ProxyPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: ProxyEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE, id, name } = params;
    // Filter out undefined values
    const queryParams = Object.fromEntries(
      Object.entries({ page, pageSize, id, name }).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );
    const response = await api.get("/proxies", { params: queryParams });
    return response.data;
  },

  // 获取所有在线代理（分页）
  getOnlineProxiesPaginated: async (
    params: ProxyPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: ProxyEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE, id, name } = params;
    // Filter out undefined values
    const queryParams = Object.fromEntries(
      Object.entries({ page, pageSize, id, name }).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );
    const response = await api.get("/proxies/online", { params: queryParams });
    return response.data;
  },

  // 获取单个代理
  getProxy: async (id: string): Promise<ProxyEntity> => {
    const response = await api.get(`/proxies/${id}`);
    return response.data;
  },

  // 创建代理
  createProxy: async (proxyData: CreateProxyDto): Promise<ProxyEntity> => {
    const response = await api.post("/proxies", proxyData);
    return response.data;
  },

  // 更新代理
  updateProxy: async (
    id: string,
    proxyData: UpdateProxyDto
  ): Promise<ProxyEntity> => {
    const response = await api.patch(`/proxies/${id}`, proxyData);
    return response.data;
  },

  // 删除代理
  deleteProxy: async (id: string): Promise<ProxyEntity> => {
    // OpenAPI spec returns ProxyEntity
    const response = await api.delete(`/proxies/${id}`);
    return response.data;
  },
};
