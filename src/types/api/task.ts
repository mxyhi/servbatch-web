/**
 * 任务相关类型定义
 */

import { BaseEntity } from "./common";

// 创建任务DTO
export interface CreateTaskDto {
  name: string;
  description?: string;
  command: string;
  timeout?: number;
}

// 任务实体
export interface TaskEntity extends BaseEntity {
  name: string;
  description: string | null;
  command: string;
  timeout: number | null;
}

// 更新任务DTO
export interface UpdateTaskDto {
  name?: string;
  description?: string;
  command?: string;
  timeout?: number;
}
