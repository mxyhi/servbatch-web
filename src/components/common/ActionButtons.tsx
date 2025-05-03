import React from "react";
import { Button, Space, ButtonProps } from "antd";
import { EditOutlined, CheckCircleOutlined } from "@ant-design/icons";
import DeleteConfirmButton from "./DeleteConfirmButton";

interface EditButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void;
  children?: React.ReactNode;
}

/**
 * 编辑按钮组件
 */
export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  children = "编辑",
  ...buttonProps
}) => {
  return (
    <Button icon={<EditOutlined />} onClick={onClick} {...buttonProps}>
      {children}
    </Button>
  );
};

interface TestConnectionButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

/**
 * 测试连接按钮组件
 */
export const TestConnectionButton: React.FC<TestConnectionButtonProps> = ({
  onClick,
  loading = false,
  children = "测试连接",
  ...buttonProps
}) => {
  return (
    <Button
      icon={<CheckCircleOutlined />}
      onClick={onClick}
      loading={loading}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

interface ActionGroupProps {
  children: React.ReactNode;
  size?: "small" | "middle" | "large";
  className?: string;
}

/**
 * 操作按钮组组件
 */
export const ActionGroup: React.FC<ActionGroupProps> = ({
  children,
  size = "middle",
  className = "",
}) => {
  return (
    <Space size={size} className={className}>
      {children}
    </Space>
  );
};

// 使用React.memo优化渲染
const MemoizedEditButton = React.memo(EditButton);
const MemoizedTestConnectionButton = React.memo(TestConnectionButton);
const MemoizedActionGroup = React.memo(ActionGroup);

export {
  MemoizedEditButton as EditButton,
  MemoizedTestConnectionButton as TestConnectionButton,
  MemoizedActionGroup as ActionGroup,
  DeleteConfirmButton,
};

export default {
  EditButton: MemoizedEditButton,
  TestConnectionButton: MemoizedTestConnectionButton,
  ActionGroup: MemoizedActionGroup,
  DeleteConfirmButton,
};
