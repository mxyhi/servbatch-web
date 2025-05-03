import React from "react";
import { Button, Popconfirm, ButtonProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  onConfirm: () => void;
  title?: string;
  okText?: string;
  cancelText?: string;
}

/**
 * 通用删除确认按钮组件
 */
const DeleteConfirmButton: React.FC<DeleteConfirmButtonProps> = ({
  onConfirm,
  title = "确定要删除吗?",
  okText = "是",
  cancelText = "否",
  children = "删除",
  ...buttonProps
}) => {
  return (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      okText={okText}
      cancelText={cancelText}
    >
      <Button danger icon={<DeleteOutlined />} {...buttonProps}>
        {children}
      </Button>
    </Popconfirm>
  );
};

export default React.memo(DeleteConfirmButton);
