/**
 * 常量和枚举定义
 */

// 服务器连接类型
export enum ConnectionType {
  DIRECT = "direct",
  PROXY = "proxy",
}

// 服务器状态
export enum ServerStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  UNKNOWN = "unknown",
}

// 状态标签配置
export const STATUS_TAG_CONFIG = {
  [ServerStatus.ONLINE]: { color: "success", text: "在线" },
  [ServerStatus.OFFLINE]: { color: "error", text: "离线" },
  [ServerStatus.UNKNOWN]: { color: "warning", text: "未知" },
};

// 执行状态
export enum ExecutionStatus {
  COMPLETED = "completed",
  FAILED = "failed",
  RUNNING = "running",
  QUEUED = "queued",
  CANCELLED = "cancelled",
}

// 执行状态标签配置
export const EXECUTION_STATUS_TAG_CONFIG = {
  [ExecutionStatus.COMPLETED]: { color: "success", text: "已完成" },
  [ExecutionStatus.FAILED]: { color: "error", text: "失败" },
  [ExecutionStatus.RUNNING]: { color: "processing", text: "运行中" },
  [ExecutionStatus.QUEUED]: { color: "warning", text: "队列中" },
  [ExecutionStatus.CANCELLED]: { color: "default", text: "已取消" },
};

// 刷新间隔（毫秒）
export const DEFAULT_REFRESH_INTERVAL = 5000;

// 导入格式
export enum ImportFormat {
  JSON = "json",
  TEXT = "text",
}

// 分页配置
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"];

// 表格大小
export enum TableSize {
  SMALL = "small",
  MIDDLE = "middle",
  LARGE = "large",
}

// 表单布局
export enum FormLayout {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
  INLINE = "inline",
}
