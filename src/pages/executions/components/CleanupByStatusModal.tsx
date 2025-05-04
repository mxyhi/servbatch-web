import React from "react";
import { Modal, Form, Checkbox, Button } from "antd";
import { CleanupByStatusDto } from "../../../types/api";
import { ExecutionStatusValue } from "../../../constants";

interface CleanupByStatusModalProps {
  visible: boolean;
  form: any;
  onClose: () => void;
  onCleanup: (data: CleanupByStatusDto) => void;
  isLoading: boolean;
}

/**
 * 按状态清理模态框组件
 */
const CleanupByStatusModal: React.FC<CleanupByStatusModalProps> = ({
  visible,
  form,
  onClose,
  onCleanup,
  isLoading,
}) => {
  const statusOptions = [
    { label: "排队中", value: "queued" },
    { label: "运行中", value: "running" },
    { label: "已完成", value: "completed" },
    { label: "失败", value: "failed" },
    { label: "已取消", value: "cancelled" },
  ];

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: { statuses: ExecutionStatusValue[] }) => {
        onCleanup({ statuses: values.statuses as any });
      });
  };

  return (
    <Modal
      title="按状态清理执行记录"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          onClick={handleSubmit}
          loading={isLoading}
        >
          清理
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="statuses"
          label="选择要清理的状态"
          rules={[
            { required: true, message: "请至少选择一个状态" },
            {
              validator: (_, value) =>
                value && value.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("请至少选择一个状态")),
            },
          ]}
        >
          <Checkbox.Group options={statusOptions} />
        </Form.Item>
        <p className="text-red-500">
          警告：此操作将永久删除所选状态的所有执行记录，无法恢复！
        </p>
      </Form>
    </Modal>
  );
};

export default CleanupByStatusModal;
