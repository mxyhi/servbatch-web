/**
 * 常量定义
 */

// 服务器连接类型
export const ConnectionType = {
  DIRECT: "direct",
  PROXY: "proxy",
} as const;

// 服务器连接类型类型
export type ConnectionTypeValue =
  (typeof ConnectionType)[keyof typeof ConnectionType];

// 服务器状态
export const ServerStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  UNKNOWN: "unknown",
} as const;

// 服务器状态类型
export type ServerStatusValue =
  (typeof ServerStatus)[keyof typeof ServerStatus];

// 状态标签配置
export const STATUS_TAG_CONFIG = {
  [ServerStatus.ONLINE]: { color: "success", text: "在线" },
  [ServerStatus.OFFLINE]: { color: "error", text: "离线" },
  [ServerStatus.UNKNOWN]: { color: "warning", text: "未知" },
} as const;

// 执行状态
export const ExecutionStatus = {
  COMPLETED: "completed",
  FAILED: "failed",
  RUNNING: "running",
  QUEUED: "queued",
  CANCELLED: "cancelled",
} as const;

// 执行状态类型
export type ExecutionStatusValue =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus];

// 执行状态标签配置
export const EXECUTION_STATUS_TAG_CONFIG = {
  [ExecutionStatus.COMPLETED]: { color: "success", text: "已完成" },
  [ExecutionStatus.FAILED]: { color: "error", text: "失败" },
  [ExecutionStatus.RUNNING]: { color: "processing", text: "运行中" },
  [ExecutionStatus.QUEUED]: { color: "warning", text: "队列中" },
  [ExecutionStatus.CANCELLED]: { color: "default", text: "已取消" },
} as const;

// 刷新间隔（毫秒）
export const DEFAULT_REFRESH_INTERVAL = 5000;

// 导入格式
export const ImportFormat = {
  JSON: "json",
  TEXT: "text",
} as const;

// 导入格式类型
export type ImportFormatValue =
  (typeof ImportFormat)[keyof typeof ImportFormat];

// 分页配置
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"] as const;

// 表格大小
export const TableSize = {
  SMALL: "small",
  MIDDLE: "middle",
  LARGE: "large",
} as const;

// 表格大小类型
export type TableSizeValue = (typeof TableSize)[keyof typeof TableSize];

// 表单布局
export const FormLayout = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  INLINE: "inline",
} as const;

// 表单布局类型
export type FormLayoutValue = (typeof FormLayout)[keyof typeof FormLayout];
