import api from './axios';

export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface UserEntity {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export const usersApi = {
  // 获取所有用户
  getAllUsers: async (): Promise<UserEntity[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  // 获取单个用户
  getUser: async (id: number): Promise<UserEntity> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // 创建用户
  createUser: async (userData: CreateUserDto): Promise<UserEntity> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // 更新用户
  updateUser: async (id: number, userData: UpdateUserDto): Promise<UserEntity> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  // 删除用户
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
