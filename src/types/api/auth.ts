/**
 * 认证相关类型定义
 */
import { UserRole } from "./user";

// 登录DTO
export interface LoginDto {
  username: string;
  password?: string; // Required in schema
}

// 登录响应
export interface LoginResponse {
  access_token: string; // 使用snake_case以匹配后端API
  user: {
    id: number;
    username: string;
    email?: string | null;
    role: UserRole;
    isActive: boolean;
  };
}
