import React, { ReactNode, useCallback } from "react";
import { Button, Space, Typography } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { AutoRefreshToggle } from "../common";
import { useModalForm } from "../../hooks/useModalForm";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import EntityTable, { EntityTableProps } from "./EntityTable";
import EntityModal from "./EntityModal";
import { EntityFormProps } from "./EntityForm";

/**
 * 实体页面属性
 */
export interface EntityPageProps<
  T extends Record<string, any>,
  C = any,
  U = any
> {
  /** 页面标题 */
  title: ReactNode;

  /** 页面副标题 */
  subtitle?: ReactNode;

  /** 实体数据 */
  entities?: T[];

  /** 是否加载中 */
  isLoading?: boolean;

  /** 表格属性 */
  tableProps: Omit<
    EntityTableProps<T>,
    "entities" | "isLoading" | "title" | "toolbar" | "onRefresh"
  >;

  /** 表单属性 */
  formProps: Omit<EntityFormProps, "form" | "isEditMode" | "onSubmit">;

  /** 模态框标题 */
  modalTitle?: (isEditMode: boolean) => ReactNode;

  /** 是否显示添加按钮 */
  showAddButton?: boolean;

  /** 添加按钮文本 */
  addButtonText?: string;

  /** 是否显示刷新按钮 */
  showRefreshButton?: boolean;

  /** 是否支持自动刷新 */
  enableAutoRefresh?: boolean;

  /** 默认自动刷新状态 */
  defaultAutoRefresh?: boolean;

  /** 自动刷新间隔（毫秒） */
  refreshInterval?: number;

  /** 是否在组件挂载时刷新 */
  refreshOnMount?: boolean;

  /** 创建实体回调 */
  onCreateEntity?: (values: C) => Promise<void>;

  /** 更新实体回调 */
  onUpdateEntity?: (id: number, values: U) => Promise<void>;

  /** 刷新回调 */
  onRefresh?: () => void;

  /** 自动刷新状态变化回调 */
  onAutoRefreshChange?: (checked: boolean) => void;

  /** 自定义工具栏 */
  toolbar?: ReactNode;

  /** 自定义页面头部 */
  header?: ReactNode;

  /** 自定义页面底部 */
  footer?: ReactNode;
}

/**
 * 通用实体页面组件
 *
 * 整合EntityTable和EntityModal的通用页面组件，提供完整的CRUD界面
 *
 * @example
 * ```tsx
 * <EntityPage
 *   title="用户管理"
 *   entities={users}
 *   isLoading={isLoading}
 *   tableProps={{
 *     columns: userColumns,
 *     rowKey: "id"
 *   }}
 *   formProps={{
 *     items: userFormItems
 *   }}
 *   onCreateEntity={createUser}
 *   onUpdateEntity={updateUser}
 *   onRefresh={refetchUsers}
 * />
 * ```
 */
function EntityPage<T extends Record<string, any>, C = any, U = any>({
  title,
  subtitle,
  entities = [],
  isLoading = false,
  tableProps,
  formProps,
  modalTitle,
  showAddButton = true,
  addButtonText = "添加",
  showRefreshButton = true,
  enableAutoRefresh = true,
  defaultAutoRefresh = false,
  refreshInterval,
  refreshOnMount = true,
  onCreateEntity,
  onUpdateEntity,
  onRefresh,
  onAutoRefreshChange,
  toolbar,
  header,
  footer,
}: EntityPageProps<T, C, U>) {
  // 使用模态框表单Hook
  const {
    visible,
    form,
    isEditMode,
    isSubmitting,
    showModal,
    hideModal,
    submitForm,
    editingEntity,
  } = useModalForm<T>({
    onSuccess: async (values, entity) => {
      if (entity && onUpdateEntity) {
        await onUpdateEntity(entity.id, values as U);
      } else if (onCreateEntity) {
        await onCreateEntity(values as C);
      }
    },
    closeOnSuccess: true,
  });

  // 使用自动刷新Hook
  const {
    autoRefresh,
    setAutoRefresh: setAutoRefreshInternal,
    refresh,
    isRefreshing,
  } = useAutoRefresh({
    defaultEnabled: defaultAutoRefresh,
    defaultInterval: refreshInterval,
    onRefresh,
    refreshOnMount,
  });

  // 自定义setAutoRefresh函数，同时更新内部状态和调用外部回调
  const setAutoRefresh = useCallback(
    (value: boolean) => {
      setAutoRefreshInternal(value);
      if (onAutoRefreshChange) {
        onAutoRefreshChange(value);
      }
    },
    [setAutoRefreshInternal, onAutoRefreshChange]
  );

  // 处理添加按钮点击
  const handleAdd = useCallback(() => {
    showModal();
  }, [showModal]);

  // 处理编辑按钮点击
  const handleEdit = useCallback(
    (entity: T) => {
      showModal(entity);
    },
    [showModal]
  );

  // 处理刷新按钮点击
  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // 渲染页面头部
  const renderHeader = useCallback(() => {
    if (header) {
      return header;
    }

    return (
      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography.Title level={4} className="m-0">
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
          )}
        </div>
        <Space>
          {enableAutoRefresh && (
            <AutoRefreshToggle
              autoRefresh={autoRefresh}
              onChange={setAutoRefresh}
              showLabel={false}
              size="small"
            />
          )}
          {toolbar}
          {showRefreshButton && (
            <Button
              icon={<SyncOutlined spin={isRefreshing} />}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          )}
          {showAddButton && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              {addButtonText}
            </Button>
          )}
        </Space>
      </div>
    );
  }, [
    header,
    title,
    subtitle,
    enableAutoRefresh,
    autoRefresh,
    setAutoRefresh,
    toolbar,
    showRefreshButton,
    isRefreshing,
    handleRefresh,
    showAddButton,
    addButtonText,
    handleAdd,
  ]);

  return (
    <div>
      {renderHeader()}

      <EntityTable
        entities={entities}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        // 移除表格中的刷新图标，因为页面顶部已经有刷新按钮
        onRefresh={undefined}
        {...tableProps}
      />

      {footer}

      <EntityModal
        title={
          modalTitle ? modalTitle(isEditMode) : isEditMode ? "编辑" : "添加"
        }
        open={visible}
        form={form}
        isEditMode={isEditMode}
        confirmLoading={isSubmitting}
        onSubmit={submitForm}
        onCancel={hideModal}
        formProps={formProps}
      />
    </div>
  );
}

export default React.memo(EntityPage) as typeof EntityPage;
