/**
 * API相关类型定义
 */
import { ID } from "./common";

// API错误
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// API响应包装
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 基础实体接口
export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

// 基础CRUD API接口
export interface CrudApi<T extends BaseEntity, C, U> {
  getAll: () => Promise<T[]>;
  getById?: (id: ID) => Promise<T>;
  create: (data: C) => Promise<T>;
  update: (id: ID, data: U) => Promise<T>;
  delete: (id: ID) => Promise<unknown>;
}

// 分页API接口
export interface PaginatedApi<T extends BaseEntity, C, U>
  extends Omit<CrudApi<T, C, U>, "getAll"> {
  getAll: (params?: Record<string, unknown>) => Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}

// 服务器状态
export type ServerStatus = "online" | "offline" | "unknown";

// 执行状态
export type ExecutionStatus =
  | "completed"
  | "failed"
  | "running"
  | "queued"
  | "cancelled";

// Pagination
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Server
export type ServerConnectionType = "direct" | "proxy";

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

export interface ImportServersDto {
  servers: CreateServerDto[];
}

export interface ImportFailureServerDto {
  server: CreateServerDto;
  reason: string;
}

export interface ImportServersResultDto {
  successCount: number;
  failureCount: number;
  successServers: ServerEntity[];
  failureServers: ImportFailureServerDto[];
}

// Proxy WebSocket (Types for documentation/reference if needed)
export interface ProxyConnectionDto {
  proxyId: string;
  apiKey: string;
}

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

export interface CommandResultDetail {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface CommandResultDto {
  commandId: string;
  result: CommandResultDetail;
}

// Task
export interface CreateTaskDto {
  name: string;
  description?: string;
  command: string;
  timeout?: number;
}

export interface TaskEntity extends BaseEntity {
  name: string;
  description: string | null;
  command: string;
  timeout: number | null;
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  command?: string;
  timeout?: number;
}

// Task Execution
export interface CreateTaskExecutionDto {
  taskId: ID;
  serverIds: ID[];
  priority?: number; // default 0
}

export interface TaskExecutionEntity extends BaseEntity {
  status: ExecutionStatus;
  output: string | null;
  exitCode: number | null;
  startedAt: string | null;
  completedAt: string | null;
  taskId: ID;
  serverId: ID;
}

// Cleanup
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

// Proxy
export type ProxyStatus = "online" | "offline";

export interface CreateProxyDto {
  id: string; // Note: ID is string for Proxy
  name: string;
  description?: string;
  apiKey?: string;
}

// ProxyEntity uses string ID, define separately instead of extending BaseEntity
export interface ProxyEntity {
  id: string;
  name: string;
  description: string | null;
  // apiKey omitted for security
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
  status: ProxyStatus; // default 'offline'
}

export interface UpdateProxyDto {
  id?: string; // Schema allows updating ID
  name?: string;
  description?: string;
  apiKey?: string;
}

// Command Monitor
export interface CreateCommandMonitorDto {
  name: string;
  description?: string;
  checkCommand: string;
  executeCommand: string;
  enabled?: boolean; // default true
  serverId: ID;
}

export interface CommandMonitorEntity extends BaseEntity {
  name: string;
  description: string | null;
  checkCommand: string;
  executeCommand: string;
  enabled: boolean;
  serverId: ID;
}

export interface UpdateCommandMonitorDto {
  name?: string;
  description?: string;
  checkCommand?: string;
  executeCommand?: string;
  enabled?: boolean; // default true
  serverId?: ID;
}

// Command Monitor Execution (Derived from API structure)
export interface CommandMonitorExecutionEntity extends BaseEntity {
  monitorId: ID; // Assuming this links to CommandMonitorEntity
  serverId: ID; // From CommandMonitorEntity
  status: ExecutionStatus; // Reusing status type
  output: string | null; // Assuming similar output structure
  exitCode: number | null; // Assuming similar exit code structure
  checkedAt: string; // Specific to monitoring?
  // createdAt, updatedAt inherited from BaseEntity
}

// User
export type UserRole = "admin" | "user";

export interface UserQueryDto extends PaginationParams {
  username?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateUserDto {
  username: string;
  password?: string; // Required in schema
  email?: string;
  role?: UserRole; // default 'user'
}

export interface UserEntity extends BaseEntity {
  username: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface UpdateUserDto {
  username?: string;
  password?: string; // Optional on update
  email?: string;
  role?: UserRole; // default 'user'
}

// Auth
export interface LoginDto {
  username: string;
  password?: string; // Required in schema
}

// Auth Response
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

// Dashboard related types (Derived from API structure)
export interface SystemSummary {
  totalServers: number;
  onlineServers: number;
  offlineServers: number;
  unknownServers: number;
  totalTasks: number;
  totalExecutions: number;
  runningExecutions: number;
  queuedExecutions: number;
}

export interface SystemSummaryWithProxies extends SystemSummary {
  totalProxies: number;
  onlineProxies: number;
}

export interface ServerStatusInfo {
  id: ID;
  name: string;
  status: ServerStatus;
}

export interface TaskStats {
  totalTasks: number;
  // Add more specific stats if defined by the endpoint logic
}

export interface ProxyStatusInfo {
  id: string; // Proxy ID is string
  name: string;
  status: ProxyStatus;
}
