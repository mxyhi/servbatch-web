import api from './axios';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email?: string;
    role: 'admin' | 'user';
    isActive: boolean;
  };
}

export const authApi = {
  // 用户登录
  login: async (loginData: LoginDto): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', loginData);
    return response.data;
  },
};
