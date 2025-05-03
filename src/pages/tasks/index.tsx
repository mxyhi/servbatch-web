import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Dropdown,
} from "antd";
import { message } from "../../utils/message";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  tasksApi,
  TaskEntity,
  CreateTaskDto,
  UpdateTaskDto,
} from "../../api/tasks";
import { serversApi } from "../../api/servers";
import { executionsApi } from "../../api/executions";

const { TextArea } = Input;

const Tasks: React.FC = () => {
  const [form] = Form.useForm();
  const [executeForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExecuteModalVisible, setIsExecuteModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<TaskEntity | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAllTasks,
  });

  const { data: servers } = useQuery({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
  });

  const createMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("任务创建成功");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(
        `创建失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("任务更新成功");
      setIsModalVisible(false);
      form.resetFields();
      setEditingTask(null);
    },
    onError: (error) => {
      message.error(
        `更新失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("任务删除成功");
    },
    onError: (error) => {
      message.error(
        `删除失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  const executeMutation = useMutation({
    mutationFn: ({
      taskId,
      serverIds,
    }: {
      taskId: number;
      serverIds: number[];
    }) => executionsApi.createExecution({ taskId, serverIds, priority: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success("任务已添加到队列");
      setIsExecuteModalVisible(false);
      setSelectedTaskId(null);
      executeForm.resetFields();
    },
    onError: (error) => {
      message.error(
        `执行失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

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

  const showExecuteModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    executeForm.resetFields();
    setIsExecuteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTask(null);
  };

  const handleExecuteCancel = () => {
    setIsExecuteModalVisible(false);
    setSelectedTaskId(null);
    executeForm.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingTask) {
        updateMutation.mutate({ id: editingTask.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleExecute = (values: { serverIds: number[] }) => {
    if (selectedTaskId) {
      executeMutation.mutate({
        taskId: selectedTaskId,
        serverIds: values.serverIds,
      });
    }
  };

  const handleViewHistory = (taskId: number) => {
    navigate(`/executions?taskId=${taskId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "命令",
      dataIndex: "command",
      key: "command",
      ellipsis: true,
    },
    {
      title: "超时(秒)",
      dataIndex: "timeout",
      key: "timeout",
      render: (text: number) => text || "-",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_: any, record: TaskEntity) => (
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => showExecuteModal(record.id)}
            size="small"
          >
            执行
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  icon: <EditOutlined />,
                  label: "编辑",
                  onClick: () => showModal(record),
                },
                {
                  key: "history",
                  icon: <HistoryOutlined />,
                  label: "历史",
                  onClick: () => handleViewHistory(record.id),
                },
                {
                  key: "delete",
                  icon: <DeleteOutlined />,
                  label: "删除",
                  danger: true,
                  onClick: () => {
                    Modal.confirm({
                      title: "确定要删除这个任务吗?",
                      onOk: () => handleDelete(record.id),
                      okText: "是",
                      cancelText: "否",
                    });
                  },
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">任务管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          添加任务
        </Button>
      </div>

      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingTask ? "编辑任务" : "添加任务"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
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

      <Modal
        title="执行任务"
        open={isExecuteModalVisible}
        onCancel={handleExecuteCancel}
        footer={null}
      >
        <Form form={executeForm} onFinish={handleExecute} layout="vertical">
          <Form.Item
            name="serverIds"
            label="选择服务器"
            rules={[{ required: true, message: "请选择至少一个服务器" }]}
          >
            <Select
              mode="multiple"
              placeholder="选择要执行任务的服务器"
              style={{ width: "100%" }}
            >
              {servers?.map((server) => (
                <Select.Option key={server.id} value={server.id}>
                  {server.name} ({server.host})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={executeMutation.isPending}
            >
              执行
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
