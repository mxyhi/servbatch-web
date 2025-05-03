import React from "react";
import { Modal, Form, DatePicker, Button } from "antd";
import { CleanupByDateDto } from "../../../api/executions";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface CleanupByDateModalProps {
  visible: boolean;
  form: any;
  onClose: () => void;
  onCleanup: (data: CleanupByDateDto) => void;
  isLoading: boolean;
}

/**
 * 按日期清理模态框组件
 */
const CleanupByDateModal: React.FC<CleanupByDateModalProps> = ({
  visible,
  form,
  onClose,
  onCleanup,
  isLoading,
}) => {
  const handleSubmit = () => {
    form.validateFields().then((values: { dateRange: [dayjs.Dayjs, dayjs.Dayjs] }) => {
      const startDate = values.dateRange[0].format("YYYY-MM-DD");
      const endDate = values.dateRange[1].format("YYYY-MM-DD");
      onCleanup({ startDate, endDate });
    });
  };

  return (
    <Modal
      title="按日期范围清理执行记录"
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
          name="dateRange"
          label="日期范围"
          rules={[{ required: true, message: "请选择日期范围" }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <p className="text-red-500">
          警告：此操作将永久删除所选日期范围内的所有执行记录，无法恢复！
        </p>
      </Form>
    </Modal>
  );
};

export default CleanupByDateModal;
