/**
 * 执行相关类型定义
 */
import { ID } from "../common";
import { BaseEntity } from "./common";

// 执行状态
export type ExecutionStatus =
  | "completed"
  | "failed"
  | "running"
  | "queued"
  | "cancelled";

// 创建任务执行DTO
export interface CreateTaskExecutionDto {
  taskId: ID;
  serverIds: ID[];
  priority?: number; // default 0
}

// 任务执行实体
export interface TaskExecutionEntity extends BaseEntity {
  status: ExecutionStatus;
  output: string | null;
  exitCode: number | null;
  startedAt: string | null;
  completedAt: string | null;
  taskId: ID;
  serverId: ID;
}

// 清理相关类型
export interface CleanupByDateDto {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

export interface CleanupResultDto {
  deletedCount: number;
  success: boolean;
  message?: string;
}

export interface CleanupByStatusDto {
  statuses: ExecutionStatus[];
}
