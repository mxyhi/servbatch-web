import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Tag,
  Select,
  Popconfirm,
  DatePicker,
  Form,
  Checkbox,
  Dropdown,
  Menu,
} from "antd";
import { message } from "../../utils/message";
import {
  DeleteOutlined,
  StopOutlined,
  EyeOutlined,
  ClearOutlined,
  CalendarOutlined,
  FilterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  executionsApi,
  TaskExecutionEntity,
  CleanupByDateDto,
  CleanupByStatusDto,
} from "../../api/executions";
import { tasksApi } from "../../api/tasks";
import { serversApi } from "../../api/servers";

const Executions: React.FC = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [cleanupByDateModalVisible, setCleanupByDateModalVisible] =
    useState(false);
  const [cleanupByStatusModalVisible, setCleanupByStatusModalVisible] =
    useState(false);
  const [selectedExecution, setSelectedExecution] =
    useState<TaskExecutionEntity | null>(null);
  const [filterTaskId, setFilterTaskId] = useState<number | null>(null);
  const [filterServerId, setFilterServerId] = useState<number | null>(null);
  const [dateForm] = Form.useForm();
  const [statusForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // 从URL查询参数中读取taskId
  useEffect(() => {
    const taskIdParam = searchParams.get("taskId");
    if (taskIdParam) {
      const taskId = parseInt(taskIdParam, 10);
      if (!isNaN(taskId)) {
        setFilterTaskId(taskId);
        setFilterServerId(null);
      }
    }
  }, [searchParams]);

  const { data: executions, isLoading } = useQuery({
    queryKey: [
      "executions",
      { taskId: filterTaskId, serverId: filterServerId },
    ],
    queryFn: async () => {
      if (filterTaskId) {
        return executionsApi.getExecutionsByTaskId(filterTaskId);
      } else if (filterServerId) {
        return executionsApi.getExecutionsByServerId(filterServerId);
      } else {
        return executionsApi.getAllExecutions();
      }
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAllTasks,
  });

  const { data: servers } = useQuery({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
  });

  const deleteMutation = useMutation({
    mutationFn: executionsApi.deleteExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success("执行记录删除成功");
    },
    onError: (error) => {
      message.error(
        `删除失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: executionsApi.cancelExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success("任务已取消");
    },
    onError: (error) => {
      message.error(
        `取消失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据日期范围清理
  const cleanupByDateMutation = useMutation({
    mutationFn: executionsApi.cleanupByDate,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
      setCleanupByDateModalVisible(false);
      dateForm.resetFields();
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据状态清理
  const cleanupByStatusMutation = useMutation({
    mutationFn: executionsApi.cleanupByStatus,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
      setCleanupByStatusModalVisible(false);
      statusForm.resetFields();
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据任务ID清理
  const cleanupByTaskIdMutation = useMutation({
    mutationFn: executionsApi.cleanupByTaskId,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据服务器ID清理
  const cleanupByServerIdMutation = useMutation({
    mutationFn: executionsApi.cleanupByServerId,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  const showDetailModal = (execution: TaskExecutionEntity) => {
    setSelectedExecution(execution);
    setDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedExecution(null);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCancel = (id: number) => {
    cancelMutation.mutate(id);
  };

  const handleTaskFilterChange = (value: number | null) => {
    setFilterTaskId(value);
    setFilterServerId(null);
  };

  const handleServerFilterChange = (value: number | null) => {
    setFilterServerId(value);
    setFilterTaskId(null);
  };

  const resetFilters = () => {
    setFilterTaskId(null);
    setFilterServerId(null);
  };

  const getTaskName = (taskId: number) => {
    const task = tasks?.find((t) => t.id === taskId);
    return task ? task.name : `任务 #${taskId}`;
  };

  const getServerName = (serverId: number) => {
    const server = servers?.find((s) => s.id === serverId);
    return server ? server.name : `服务器 #${serverId}`;
  };

  // 显示按日期清理模态框
  const showCleanupByDateModal = () => {
    setCleanupByDateModalVisible(true);
  };

  // 显示按状态清理模态框
  const showCleanupByStatusModal = () => {
    setCleanupByStatusModalVisible(true);
  };

  // 处理按日期清理
  const handleCleanupByDate = (values: any) => {
    const { dateRange } = values;
    if (dateRange && dateRange.length === 2) {
      const cleanupData: CleanupByDateDto = {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      };
      cleanupByDateMutation.mutate(cleanupData);
    }
  };

  // 处理按状态清理
  const handleCleanupByStatus = (values: any) => {
    const { statuses } = values;
    if (statuses && statuses.length > 0) {
      const cleanupData: CleanupByStatusDto = {
        statuses: statuses,
      };
      cleanupByStatusMutation.mutate(cleanupData);
    }
  };

  // 处理按任务ID清理
  const handleCleanupByTaskId = (taskId: number) => {
    Modal.confirm({
      title: "确认清理",
      content: `确定要清理任务 "${getTaskName(
        taskId
      )}" 的所有执行记录吗？此操作不可恢复。`,
      onOk: () => {
        cleanupByTaskIdMutation.mutate(taskId);
      },
      okText: "确定",
      cancelText: "取消",
    });
  };

  // 处理按服务器ID清理
  const handleCleanupByServerId = (serverId: number) => {
    Modal.confirm({
      title: "确认清理",
      content: `确定要清理服务器 "${getServerName(
        serverId
      )}" 的所有执行记录吗？此操作不可恢复。`,
      onOk: () => {
        cleanupByServerIdMutation.mutate(serverId);
      },
      okText: "确定",
      cancelText: "取消",
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "任务",
      dataIndex: "taskId",
      key: "taskId",
      render: (taskId: number) => getTaskName(taskId),
    },
    {
      title: "服务器",
      dataIndex: "serverId",
      key: "serverId",
      render: (serverId: number) => getServerName(serverId),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "completed") color = "success";
        if (status === "failed") color = "error";
        if (status === "running") color = "processing";
        if (status === "queued") color = "warning";
        if (status === "cancelled") color = "default";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "开始时间",
      dataIndex: "startedAt",
      key: "startedAt",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: "完成时间",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "-"),
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
      render: (_: any, record: TaskExecutionEntity) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
          >
            详情
          </Button>
          {(record.status === "queued" || record.status === "running") && (
            <Popconfirm
              title="确定要取消这个任务吗?"
              onConfirm={() => handleCancel(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button icon={<StopOutlined />}>取消</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确定要删除这个执行记录吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 清理菜单项
  const cleanupMenuItems = [
    {
      key: "byDate",
      icon: <CalendarOutlined />,
      label: "按日期范围清理",
      onClick: showCleanupByDateModal,
    },
    {
      key: "byStatus",
      icon: <FilterOutlined />,
      label: "按状态清理",
      onClick: showCleanupByStatusModal,
    },
    ...(filterTaskId
      ? [
          {
            key: "byTask",
            icon: <DeleteOutlined />,
            label: "清理当前任务所有记录",
            danger: true,
            onClick: () => handleCleanupByTaskId(filterTaskId),
          },
        ]
      : []),
    ...(filterServerId
      ? [
          {
            key: "byServer",
            icon: <DeleteOutlined />,
            label: "清理当前服务器所有记录",
            danger: true,
            onClick: () => handleCleanupByServerId(filterServerId),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">执行记录</h1>
        <div className="flex space-x-4">
          <Select
            style={{ width: 200 }}
            placeholder="按任务筛选"
            allowClear
            onChange={handleTaskFilterChange}
            value={filterTaskId}
          >
            {tasks?.map((task) => (
              <Select.Option key={task.id} value={task.id}>
                {task.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="按服务器筛选"
            allowClear
            onChange={handleServerFilterChange}
            value={filterServerId}
          >
            {servers?.map((server) => (
              <Select.Option key={server.id} value={server.id}>
                {server.name}
              </Select.Option>
            ))}
          </Select>
          {(filterTaskId || filterServerId) && (
            <Button onClick={resetFilters}>重置筛选</Button>
          )}
          <Dropdown menu={{ items: cleanupMenuItems }}>
            <Button icon={<ClearOutlined />}>清理记录</Button>
          </Dropdown>
        </div>
      </div>

      <Table
        dataSource={executions}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title="执行详情"
        open={detailModalVisible}
        onCancel={handleDetailModalClose}
        footer={[
          <Button key="close" onClick={handleDetailModalClose}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedExecution && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p>
                  <strong>任务:</strong> {getTaskName(selectedExecution.taskId)}
                </p>
                <p>
                  <strong>服务器:</strong>{" "}
                  {getServerName(selectedExecution.serverId)}
                </p>
                <p>
                  <strong>状态:</strong> {selectedExecution.status}
                </p>
                <p>
                  <strong>退出代码:</strong>{" "}
                  {selectedExecution.exitCode !== undefined
                    ? selectedExecution.exitCode
                    : "-"}
                </p>
              </div>
              <div>
                <p>
                  <strong>创建时间:</strong>{" "}
                  {new Date(selectedExecution.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>开始时间:</strong>{" "}
                  {selectedExecution.startedAt
                    ? new Date(selectedExecution.startedAt).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <strong>完成时间:</strong>{" "}
                  {selectedExecution.completedAt
                    ? new Date(selectedExecution.completedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">输出:</h3>
              <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96 font-mono whitespace-pre-wrap">
                {selectedExecution.output || "无输出"}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 按日期范围清理模态框 */}
      <Modal
        title="按日期范围清理执行记录"
        open={cleanupByDateModalVisible}
        onCancel={() => setCleanupByDateModalVisible(false)}
        footer={null}
      >
        <Form form={dateForm} onFinish={handleCleanupByDate} layout="vertical">
          <Form.Item
            name="dateRange"
            label="日期范围"
            rules={[{ required: true, message: "请选择日期范围" }]}
          >
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                type="default"
                onClick={() => setCleanupByDateModalVisible(false)}
                className="mr-2"
              >
                取消
              </Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={cleanupByDateMutation.isPending}
              >
                清理
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 按状态清理模态框 */}
      <Modal
        title="按状态清理执行记录"
        open={cleanupByStatusModalVisible}
        onCancel={() => setCleanupByStatusModalVisible(false)}
        footer={null}
      >
        <Form
          form={statusForm}
          onFinish={handleCleanupByStatus}
          layout="vertical"
        >
          <Form.Item
            name="statuses"
            label="状态"
            rules={[{ required: true, message: "请选择至少一个状态" }]}
          >
            <Checkbox.Group className="flex flex-col gap-2">
              <Checkbox value="completed">已完成</Checkbox>
              <Checkbox value="failed">失败</Checkbox>
              <Checkbox value="cancelled">已取消</Checkbox>
              <Checkbox value="queued">队列中</Checkbox>
              <Checkbox value="running">运行中</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                type="default"
                onClick={() => setCleanupByStatusModalVisible(false)}
                className="mr-2"
              >
                取消
              </Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={cleanupByStatusMutation.isPending}
              >
                清理
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Executions;
