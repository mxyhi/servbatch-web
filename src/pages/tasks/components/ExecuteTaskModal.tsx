import React from "react";
import { Modal, Form, Checkbox, Button } from "antd";
import { ServerEntity } from "../../../api/servers";

interface ExecuteTaskModalProps {
  visible: boolean;
  form: any;
  servers: ServerEntity[] | undefined;
  checkAll: boolean;
  indeterminate: boolean;
  onCancel: () => void;
  onExecute: (values: { serverIds: number[] }) => void;
  onCheckAllChange: (e: any) => void;
  onServerSelectChange: (selectedServerIds: number[]) => void;
  isLoading: boolean;
}

/**
 * 执行任务模态框组件
 */
const ExecuteTaskModal: React.FC<ExecuteTaskModalProps> = ({
  visible,
  form,
  servers,
  checkAll,
  indeterminate,
  onCancel,
  onExecute,
  onCheckAllChange,
  onServerSelectChange,
  isLoading,
}) => {
  const handleSubmit = () => {
    form.validateFields().then((values: { serverIds: number[] }) => {
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
    >
      <Form form={form} layout="vertical">
        <div className="mb-2">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        </div>
        <Form.Item
          name="serverIds"
          rules={[{ required: true, message: "请选择至少一个服务器" }]}
        >
          <Checkbox.Group
            className="flex flex-col gap-2"
            onChange={onServerSelectChange as any}
          >
            {servers?.map((server) => (
              <Checkbox key={server.id} value={server.id}>
                {server.name} ({server.host})
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExecuteTaskModal;
