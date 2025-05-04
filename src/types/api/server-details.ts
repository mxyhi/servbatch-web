/**
 * 服务器详情相关类型定义
 */
import { ServerEntity } from "./server";

// 服务器详情
export interface ServerDetails extends ServerEntity {
  bootTime: string; // 开机时间
  uptime: number; // 运行时间（秒）
}

// CPU使用情况
export interface CpuUsage {
  usage: number; // CPU使用率（百分比）
  cores: number; // CPU核心数
  loadAverage: number[]; // 1分钟、5分钟、15分钟负载
}

// 内存使用情况
export interface MemoryUsage {
  total: number; // 总内存（MB）
  used: number; // 已使用内存（MB）
  free: number; // 空闲内存（MB）
  usage: number; // 内存使用率（百分比）
}

// GPU使用情况
export interface GpuUsage {
  index: number; // GPU索引
  name: string; // GPU名称
  usage: number; // GPU使用率（百分比）
  memory: {
    total: number; // 总显存（MB）
    used: number; // 已使用显存（MB）
    free: number; // 空闲显存（MB）
    usage: number; // 显存使用率（百分比）
  };
  temperature: number; // 温度（摄氏度）
}

// 服务器资源使用情况
export interface ServerResources {
  cpu: CpuUsage;
  memory: MemoryUsage;
  gpu: GpuUsage[]; // GPU列表，可能为空
  timestamp: string; // 数据采集时间
}

// 执行命令请求
export interface ExecuteCommandRequest {
  command: string; // 要执行的命令
  timeout?: number; // 超时时间（秒）
}

// 执行命令响应
export interface ExecuteCommandResponse {
  stdout: string; // 标准输出
  stderr: string; // 标准错误
  exitCode: number; // 退出码
}

// 终端会话
export interface TerminalSession {
  sessionId: string; // 会话ID
  webSocketUrl: string; // WebSocket URL
}

// 终端WebSocket消息类型
export type TerminalMessageType = "input" | "output" | "close";

// 终端WebSocket消息
export interface TerminalMessage {
  type: TerminalMessageType;
  data?: string;
}
