import React, { ReactNode, useCallback } from "react";
import { Modal, Form, FormInstance, ModalProps } from "antd";

interface FormModalProps extends Omit<ModalProps, "onOk" | "onCancel"> {
  // 基本属性
  title: string;
  open: boolean;

  // 回调函数
  onCancel: () => void;
  onOk: () => void;

  // 表单相关
  form: FormInstance;
  children: ReactNode;

  // 可选属性
  confirmLoading?: boolean;
  width?: number | string;
  footer?: ReactNode;
  formLayout?: "horizontal" | "vertical" | "inline";

  // 自动处理表单验证
  autoValidate?: boolean;
}

/**
 * 通用表单模态框组件
 *
 * 结合Modal和Form的通用组件，用于创建和编辑实体
 */
const FormModal: React.FC<FormModalProps> = ({
  title,
  open,
  onCancel,
  onOk,
  form,
  children,
  confirmLoading = false,
  width,
  footer,
  formLayout = "vertical",
  autoValidate = true,
  ...restProps
}) => {
  // 处理确认按钮点击
  const handleOk = useCallback(() => {
    if (autoValidate) {
      form
        .validateFields()
        .then(() => {
          onOk();
        })
        .catch((err) => {
          console.log("表单验证失败:", err);
        });
    } else {
      onOk();
    }
  }, [autoValidate, form, onOk]);

  // 处理取消按钮点击
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      width={width}
      footer={footer}
      destroyOnClose
      maskClosable={false}
      forceRender
      {...restProps}
    >
      <Form form={form} layout={formLayout} preserve={false}>
        {children}
      </Form>
    </Modal>
  );
};

export default React.memo(FormModal);
