import React, { ReactNode, useCallback } from "react";
import { Modal, ModalProps, FormInstance } from "antd";
import EntityForm, { EntityFormProps } from "./EntityForm";

/**
 * 实体模态框属性
 */
export interface EntityModalProps extends Omit<ModalProps, "onOk"> {
  /** 表单实例 */
  form: FormInstance;
  
  /** 表单属性 */
  formProps?: Omit<EntityFormProps, "form">;
  
  /** 是否处于编辑模式 */
  isEditMode?: boolean;
  
  /** 是否显示表单底部按钮 */
  showFormButtons?: boolean;
  
  /** 是否在提交成功后关闭模态框 */
  closeOnSuccess?: boolean;
  
  /** 模态框标题 */
  title?: ReactNode;
  
  /** 模态框宽度 */
  width?: number | string;
  
  /** 是否显示模态框 */
  open?: boolean;
  
  /** 是否显示取消按钮 */
  showCancelButton?: boolean;
  
  /** 是否显示确认按钮 */
  showOkButton?: boolean;
  
  /** 确认按钮文本 */
  okText?: string;
  
  /** 取消按钮文本 */
  cancelText?: string;
  
  /** 确认按钮加载状态 */
  confirmLoading?: boolean;
  
  /** 表单提交回调 */
  onSubmit?: (values: any) => void | Promise<void>;
  
  /** 模态框关闭回调 */
  onCancel?: () => void;
  
  /** 自定义模态框内容 */
  children?: ReactNode;
}

/**
 * 通用实体模态框组件
 * 
 * 结合Modal和EntityForm的通用组件，用于创建和编辑实体
 * 
 * @example
 * ```tsx
 * <EntityModal
 *   title={isEditMode ? "编辑用户" : "添加用户"}
 *   open={visible}
 *   form={form}
 *   isEditMode={isEditMode}
 *   confirmLoading={isSubmitting}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   formProps={{
 *     items: [
 *       {
 *         name: "name",
 *         label: "姓名",
 *         component: <Input />,
 *         rules: [{ required: true, message: "请输入姓名" }]
 *       },
 *       {
 *         name: "email",
 *         label: "邮箱",
 *         component: <Input />,
 *         rules: [{ required: true, message: "请输入邮箱" }]
 *       }
 *     ]
 *   }}
 * />
 * ```
 */
const EntityModal: React.FC<EntityModalProps> = ({
  form,
  formProps,
  isEditMode = false,
  showFormButtons = false,
  closeOnSuccess = true,
  title,
  width = 520,
  open = false,
  showCancelButton = true,
  showOkButton = true,
  okText = isEditMode ? "更新" : "创建",
  cancelText = "取消",
  confirmLoading = false,
  onSubmit,
  onCancel,
  children,
  ...restProps
}) => {
  // 处理表单提交
  const handleSubmit = useCallback(
    async (values: any) => {
      if (onSubmit) {
        await onSubmit(values);
      }
    },
    [onSubmit]
  );
  
  // 处理模态框确认
  const handleOk = useCallback(() => {
    form.submit();
  }, [form]);
  
  // 处理模态框取消
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);
  
  return (
    <Modal
      title={title}
      width={width}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      okButtonProps={{ style: { display: showOkButton ? "inline-block" : "none" } }}
      cancelButtonProps={{ style: { display: showCancelButton ? "inline-block" : "none" } }}
      destroyOnClose
      {...restProps}
    >
      {formProps ? (
        <EntityForm
          form={form}
          isEditMode={isEditMode}
          showSubmitButton={showFormButtons}
          showResetButton={showFormButtons}
          showCancelButton={false}
          submitText={okText}
          submitLoading={confirmLoading}
          onSubmit={handleSubmit}
          {...formProps}
        />
      ) : (
        children
      )}
    </Modal>
  );
};

export default React.memo(EntityModal);
