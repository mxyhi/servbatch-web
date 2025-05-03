import React, { ReactNode, useCallback } from "react";
import { Form, FormInstance, FormProps } from "antd";
import { FormLayout } from "antd/es/form/Form";
import { FormItem, FormFooter } from "./form";
import {
  FormItem as FormItemType,
  FormSubmitCallback,
  FormValuesChangeCallback,
  FormFieldsChangeCallback,
} from "../../types/form";

/**
 * 实体表单属性
 */
export interface EntityFormProps extends Omit<FormProps, "form"> {
  /** 表单实例 */
  form: FormInstance;

  /** 表单项配置 */
  items?: FormItemType[];

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
  onSubmit?: FormSubmitCallback;

  /** 表单重置回调 */
  onReset?: () => void;

  /** 表单取消回调 */
  onCancel?: () => void;

  /** 表单值变化回调 */
  onValuesChange?: FormValuesChangeCallback;

  /** 表单字段变化回调 */
  onFieldsChange?: FormFieldsChangeCallback;

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
    (values: Record<string, unknown>) => {
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
      <div className={formLayoutClass}>
        {items
          .filter((item) => {
            // 过滤隐藏的表单项
            if (item.hidden) return false;
            // 过滤只在特定模式显示的表单项
            if (item.editOnly && !isEditMode) return false;
            if (item.createOnly && isEditMode) return false;
            return true;
          })
          .map((item, index) => (
            <FormItem
              key={`form-item-${item.name}-${index}`}
              item={item}
              form={form}
              isEditMode={isEditMode}
            />
          ))}
      </div>

      {children}

      {footer || (
        <FormFooter
          showSubmitButton={showSubmitButton}
          showResetButton={showResetButton}
          showCancelButton={showCancelButton}
          submitText={submitText}
          resetText={resetText}
          cancelText={cancelText}
          submitLoading={submitLoading}
          onReset={handleReset}
          onCancel={handleCancel}
        />
      )}
    </Form>
  );
};

export default React.memo(EntityForm);
