/**
 * 命令监控相关类型定义
 */
import { ID } from "../common";
import { BaseEntity } from "./common";
import { ExecutionStatus } from "./execution";

// 创建命令监控DTO
export interface CreateCommandMonitorDto {
  name: string;
  description?: string;
  checkCommand: string;
  executeCommand: string;
  enabled?: boolean; // default true
  serverId: ID;
}

// 命令监控实体
export interface CommandMonitorEntity extends BaseEntity {
  name: string;
  description: string | null;
  checkCommand: string;
  executeCommand: string;
  enabled: boolean;
  serverId: ID;
}

// 更新命令监控DTO
export interface UpdateCommandMonitorDto {
  name?: string;
  description?: string;
  checkCommand?: string;
  executeCommand?: string;
  enabled?: boolean; // default true
  serverId?: ID;
}

// 命令监控执行实体
export interface CommandMonitorExecutionEntity extends BaseEntity {
  monitorId: ID; // Assuming this links to CommandMonitorEntity
  serverId: ID; // From CommandMonitorEntity
  status: ExecutionStatus; // Reusing status type
  output: string | null; // Assuming similar output structure
  exitCode: number | null; // Assuming similar exit code structure
  checkedAt: string; // Specific to monitoring?
  // createdAt, updatedAt inherited from BaseEntity
}
