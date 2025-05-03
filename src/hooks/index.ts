/**
 * 自定义Hooks导出文件
 *
 * 统一导出所有自定义Hooks，方便使用
 */

// 基础Hooks
export { default as useAutoRefresh } from "./useAutoRefresh";
export { default as useModal } from "./useModal";
export { useModalForm } from "./useModalForm";
export { default as useEntityForm } from "./useEntityForm";

// 实体操作Hooks
export { useEntityCRUD } from "./useEntityCRUD";
export { useCrudOperations } from "./useCrudOperations";

// 业务Hooks
export { useServerImport } from "./useServerImport";

// 废弃的Hooks (将在未来版本中移除)
// @deprecated 使用 useEntityCRUD 替代
export { useServers } from "./useServers";
