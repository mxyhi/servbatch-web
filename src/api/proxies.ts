import api from './axios';

export interface CreateProxyDto {
  id: string;
  name: string;
  description?: string;
  apiKey?: string;
}

export interface ProxyEntity {
  id: string;
  name: string;
  description?: string;
  apiKey?: string;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
  status: 'online' | 'offline';
}

export interface UpdateProxyDto {
  id?: string;
  name?: string;
  description?: string;
  apiKey?: string;
}

export const proxiesApi = {
  // 获取所有代理
  getAllProxies: async (): Promise<ProxyEntity[]> => {
    const response = await api.get('/proxies');
    return response.data;
  },

  // 获取所有在线代理
  getOnlineProxies: async (): Promise<ProxyEntity[]> => {
    const response = await api.get('/proxies/online');
    return response.data;
  },

  // 获取单个代理
  getProxy: async (id: string): Promise<ProxyEntity> => {
    const response = await api.get(`/proxies/${id}`);
    return response.data;
  },

  // 创建代理
  createProxy: async (proxyData: CreateProxyDto): Promise<ProxyEntity> => {
    const response = await api.post('/proxies', proxyData);
    return response.data;
  },

  // 更新代理
  updateProxy: async (id: string, proxyData: UpdateProxyDto): Promise<ProxyEntity> => {
    const response = await api.patch(`/proxies/${id}`, proxyData);
    return response.data;
  },

  // 删除代理
  deleteProxy: async (id: string): Promise<ProxyEntity> => {
    const response = await api.delete(`/proxies/${id}`);
    return response.data;
  },
};
