/**
 * 服务器相关类型定义
 */
import { ID } from "../common";
import { BaseEntity } from "./common";

// 服务器连接类型
export type ServerConnectionType = "direct" | "proxy";

// 服务器状态
export type ServerStatus = "online" | "offline" | "unknown";

// 创建服务器DTO
export interface CreateServerDto {
  name: string;
  host: string;
  port?: number; // default 22
  username: string;
  password?: string;
  privateKey?: string;
  connectionType?: ServerConnectionType; // default 'direct'
  proxyId?: string;
}

// 服务器实体
export interface ServerEntity extends BaseEntity {
  name: string;
  host: string;
  port: number;
  username: string;
  // password and privateKey are objects/omitted in schema for reads
  status: ServerStatus;
  lastChecked: string | null;
  connectionType: ServerConnectionType;
  proxyId: string | null;
}

// 更新服务器DTO
export interface UpdateServerDto {
  name?: string;
  host?: string;
  port?: number; // default 22
  username?: string;
  password?: string;
  privateKey?: string;
  connectionType?: ServerConnectionType; // default 'direct'
  proxyId?: string;
}

// 导入服务器DTO
export interface ImportServersDto {
  servers: CreateServerDto[];
}

// 导入失败的服务器DTO
export interface ImportFailureServerDto {
  server: CreateServerDto;
  reason: string;
}

// 导入服务器结果DTO
export interface ImportServersResultDto {
  successCount: number;
  failureCount: number;
  successServers: ServerEntity[];
  failureServers: ImportFailureServerDto[];
}

// 执行命令DTO
export interface ExecuteCommandDto {
  commandId: string;
  serverId: number;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  command: string;
  timeout?: number;
}

// 命令结果详情
export interface CommandResultDetail {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// 命令结果DTO
export interface CommandResultDto {
  commandId: string;
  result: CommandResultDetail;
}
