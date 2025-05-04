import api from "./axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  CreateUserDto,
  UserEntity,
  UpdateUserDto,
  UserQueryDto, // Use the specific query DTO from global types
  PaginationParams,
} from "../types/api"; // Import global types
import { ID } from "../types/common"; // Import ID type

// Define specific pagination params extending UserQueryDto
export interface UserPaginationParams
  extends PaginationParams,
    Omit<UserQueryDto, "page" | "pageSize"> {}

export const usersApi = {
  // 获取用户列表（分页）
  getUsersPaginated: async (
    params: UserPaginationParams = {}
  ): Promise<{
    // Use inline structure
    items: UserEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      username,
      email,
      role,
      isActive,
    } = params;
    // Filter out undefined values
    const queryParams = Object.fromEntries(
      Object.entries({
        page,
        pageSize,
        username,
        email,
        role,
        isActive,
      }).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const response = await api.get("/users", { params: queryParams });
    return response.data;
  },

  // 获取单个用户
  getUser: async (id: ID): Promise<UserEntity> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // 创建用户
  createUser: async (userData: CreateUserDto): Promise<UserEntity> => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // 更新用户
  updateUser: async (id: ID, userData: UpdateUserDto): Promise<UserEntity> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  // 删除用户
  deleteUser: async (id: ID): Promise<void> => {
    // OpenAPI: 200 "用户删除成功", no body
    await api.delete(`/users/${id}`);
  },
};
