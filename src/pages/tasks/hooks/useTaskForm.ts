import { useState } from "react";
import { Form } from "antd";
import { TaskEntity } from "../../../api/tasks";

/**
 * 处理任务表单的自定义Hook
 */
export const useTaskForm = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskEntity | null>(null);

  // 显示模态框
  const showModal = (task?: TaskEntity) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        name: task.name,
        description: task.description,
        command: task.command,
        timeout: task.timeout,
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTask(null);
  };

  return {
    form,
    isModalVisible,
    editingTask,
    showModal,
    handleCancel,
  };
};
