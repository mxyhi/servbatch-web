import React from "react";
import { Modal, Form, Button } from "antd";
import DebounceSelect from "../../../components/common/DebounceSelect";
import { ID } from "../../../types/common";

interface ExecuteTaskModalProps {
  visible: boolean;
  form: any;
  onCancel: () => void;
  onExecute: (values: { serverIds: ID[] }) => void;
  isLoading: boolean;
  fetchServerOptions: (
    search: string,
    page: number
  ) => Promise<{
    data: { label: string; value: ID }[];
    total: number;
  }>;
  fetchAllServerOptions?: () => Promise<{ label: string; value: ID }[]>;
}

/**
 * 执行任务模态框组件
 */
const ExecuteTaskModal: React.FC<ExecuteTaskModalProps> = ({
  visible,
  form,
  onCancel,
  onExecute,
  isLoading,
  fetchServerOptions,
  fetchAllServerOptions,
}) => {
  const handleSubmit = () => {
    form.validateFields().then((values: { serverIds: ID[] }) => {
      onExecute(values);
    });
  };

  return (
    <Modal
      title="选择执行服务器"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
        >
          执行
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="serverIds"
          label="选择服务器"
          rules={[{ required: true, message: "请选择至少一个服务器" }]}
        >
          <DebounceSelect
            mode="multiple"
            placeholder="点击选择服务器"
            fetchOptions={fetchServerOptions}
            fetchAllOptions={fetchAllServerOptions}
            showSelectAll={true}
            style={{ width: "100%" }}
            optionFilterProp="label"
            optionLabelProp="label"
            maxTagCount="responsive"
            virtual={false} // 禁用虚拟滚动，避免全选时出现问题
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExecuteTaskModal;
