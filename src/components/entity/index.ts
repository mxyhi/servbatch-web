/**
 * 实体组件导出文件
 * 
 * 统一导出所有实体相关组件，方便使用
 */

// 表格组件
export { default as EntityTable } from "./EntityTable";
export type { EntityTableProps } from "./EntityTable";

// 表单组件
export { default as EntityForm } from "./EntityForm";
export type { EntityFormProps, EntityFormItem } from "./EntityForm";

// 模态框组件
export { default as EntityModal } from "./EntityModal";
export type { EntityModalProps } from "./EntityModal";

// 页面组件
export { default as EntityPage } from "./EntityPage";
export type { EntityPageProps } from "./EntityPage";
