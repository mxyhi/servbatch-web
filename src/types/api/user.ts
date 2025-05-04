/**
 * 用户相关类型定义
 */
import { BaseEntity } from "./common";
import { PaginationParams } from "./pagination";

// 用户角色
export type UserRole = "admin" | "user";

// 用户查询DTO
export interface UserQueryDto extends PaginationParams {
  username?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

// 创建用户DTO
export interface CreateUserDto {
  username: string;
  password?: string; // Required in schema
  email?: string;
  role?: UserRole; // default 'user'
}

// 用户实体
export interface UserEntity extends BaseEntity {
  username: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
}

// 更新用户DTO
export interface UpdateUserDto {
  username?: string;
  password?: string; // Optional on update
  email?: string;
  role?: UserRole; // default 'user'
}
