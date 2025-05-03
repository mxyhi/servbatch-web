import React, { ReactNode, useCallback, useEffect } from "react";
import { Form, FormInstance, FormProps, Button, Space } from "antd";
import { FormLayout } from "antd/es/form/Form";

/**
 * 表单项配置
 */
export interface EntityFormItem {
  /** 表单项名称 */
  name: string;

  /** 表单项标签 */
  label?: ReactNode;

  /** 表单项组件 */
  component: ReactNode;

  /** 表单项规则 */
  rules?: any[];

  /** 表单项提示 */
  tooltip?: ReactNode;

  /** 表单项额外信息 */
  extra?: ReactNode;

  /** 表单项是否禁用 */
  disabled?: boolean;

  /** 表单项是否隐藏 */
  hidden?: boolean;

  /** 表单项依赖字段 */
  dependencies?: string[];

  /** 表单项是否只在编辑模式显示 */
  editOnly?: boolean;

  /** 表单项是否只在创建模式显示 */
  createOnly?: boolean;

  /** 表单项栅格配置 */
  colSpan?: number;

  /** 表单项自定义渲染函数 */
  render?: (
    item: EntityFormItem,
    form: FormInstance,
    isEditMode: boolean
  ) => ReactNode;
}

/**
 * 实体表单属性
 */
export interface EntityFormProps extends Omit<FormProps, "form"> {
  /** 表单实例 */
  form: FormInstance;

  /** 表单项配置 */
  items?: EntityFormItem[];

  /** 表单布局 */
  layout?: FormLayout;

  /** 是否处于编辑模式 */
  isEditMode?: boolean;

  /** 是否显示提交按钮 */
  showSubmitButton?: boolean;

  /** 是否显示重置按钮 */
  showResetButton?: boolean;

  /** 是否显示取消按钮 */
  showCancelButton?: boolean;

  /** 提交按钮文本 */
  submitText?: string;

  /** 重置按钮文本 */
  resetText?: string;

  /** 取消按钮文本 */
  cancelText?: string;

  /** 提交按钮加载状态 */
  submitLoading?: boolean;

  /** 表单底部内容 */
  footer?: ReactNode;

  /** 表单提交回调 */
  onSubmit?: (values: any) => void;

  /** 表单重置回调 */
  onReset?: () => void;

  /** 表单取消回调 */
  onCancel?: () => void;

  /** 表单值变化回调 */
  onValuesChange?: (changedValues: any, allValues: any) => void;

  /** 表单字段变化回调 */
  onFieldsChange?: (changedFields: any[], allFields: any[]) => void;

  /** 自定义表单内容 */
  children?: ReactNode;

  /** 表单栅格列数 */
  columns?: number;

  /** 表单项间距 */
  gutter?: number;
}

/**
 * 通用实体表单组件
 *
 * 基于Ant Design Form组件，支持动态表单项配置
 *
 * @example
 * ```tsx
 * <EntityForm
 *   form={form}
 *   isEditMode={!!editingUser}
 *   items={[
 *     {
 *       name: "name",
 *       label: "姓名",
 *       component: <Input />,
 *       rules: [{ required: true, message: "请输入姓名" }]
 *     },
 *     {
 *       name: "email",
 *       label: "邮箱",
 *       component: <Input />,
 *       rules: [{ required: true, message: "请输入邮箱" }]
 *     }
 *   ]}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
const EntityForm: React.FC<EntityFormProps> = ({
  form,
  items = [],
  layout = "vertical",
  isEditMode = false,
  showSubmitButton = true,
  showResetButton = true,
  showCancelButton = true,
  submitText = isEditMode ? "更新" : "创建",
  resetText = "重置",
  cancelText = "取消",
  submitLoading = false,
  footer,
  onSubmit,
  onReset,
  onCancel,
  onValuesChange,
  onFieldsChange,
  children,
  columns = 1,
  gutter = 16,
  ...restProps
}) => {
  // 处理表单提交
  const handleFinish = useCallback(
    (values: any) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
    [onSubmit]
  );

  // 处理表单重置
  const handleReset = useCallback(() => {
    form.resetFields();
    if (onReset) {
      onReset();
    }
  }, [form, onReset]);

  // 处理表单取消
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // 渲染表单项
  const renderFormItems = useCallback(() => {
    return items
      .filter((item) => {
        // 过滤隐藏的表单项
        if (item.hidden) return false;

        // 过滤只在特定模式显示的表单项
        if (item.editOnly && !isEditMode) return false;
        if (item.createOnly && isEditMode) return false;

        return true;
      })
      .map((item, index) => {
        // 如果有自定义渲染函数，使用自定义渲染
        if (item.render) {
          return (
            <React.Fragment key={`form-item-${item.name}-${index}`}>
              {item.render(item, form, isEditMode)}
            </React.Fragment>
          );
        }

        // 默认渲染
        return (
          <div
            key={`form-item-${item.name}-${index}`}
            className={`col-span-${item.colSpan || 1}`}
          >
            <Form.Item
              name={item.name}
              label={item.label}
              rules={item.rules}
              tooltip={item.tooltip}
              extra={item.extra}
              dependencies={item.dependencies}
              hidden={item.hidden}
            >
              {item.component}
            </Form.Item>
          </div>
        );
      });
  }, [items, isEditMode, form]);

  // 渲染表单底部
  const renderFooter = useCallback(() => {
    if (footer) {
      return footer;
    }

    if (!showSubmitButton && !showResetButton && !showCancelButton) {
      return null;
    }

    return (
      <Form.Item className="mb-0 mt-4">
        <Space>
          {showSubmitButton && (
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              {submitText}
            </Button>
          )}
          {showResetButton && (
            <Button onClick={handleReset}>{resetText}</Button>
          )}
          {showCancelButton && (
            <Button onClick={handleCancel}>{cancelText}</Button>
          )}
        </Space>
      </Form.Item>
    );
  }, [
    footer,
    showSubmitButton,
    showResetButton,
    showCancelButton,
    submitText,
    resetText,
    cancelText,
    submitLoading,
    handleReset,
    handleCancel,
  ]);

  // 表单布局样式
  const formLayoutClass = React.useMemo(() => {
    if (columns <= 1) return "";
    return `grid grid-cols-${columns} gap-${gutter}`;
  }, [columns, gutter]);

  return (
    <Form
      form={form}
      layout={layout}
      onFinish={handleFinish}
      onValuesChange={onValuesChange}
      onFieldsChange={onFieldsChange}
      {...restProps}
    >
      <div className={formLayoutClass}>{renderFormItems()}</div>
      {children}
      {renderFooter()}
    </Form>
  );
};

export default React.memo(EntityForm);
