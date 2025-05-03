import React from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import { TaskEntity, CreateTaskDto, UpdateTaskDto } from "../../../api/tasks";

const { TextArea } = Input;

interface TaskFormModalProps {
  visible: boolean;
  form: any;
  editingTask: TaskEntity | null;
  onCancel: () => void;
  onSubmit: (values: CreateTaskDto | UpdateTaskDto) => boolean;
}

/**
 * 任务表单模态框组件
 */
const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  form,
  editingTask,
  onCancel,
  onSubmit,
}) => {
  const handleSubmit = () => {
    form.validateFields().then((values: CreateTaskDto | UpdateTaskDto) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={editingTask ? "编辑任务" : "添加任务"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="任务名称"
          rules={[{ required: true, message: "请输入任务名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="任务描述">
          <Input />
        </Form.Item>
        <Form.Item
          name="command"
          label="执行命令"
          rules={[{ required: true, message: "请输入执行命令" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="timeout" label="超时时间(秒)">
          <InputNumber min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
