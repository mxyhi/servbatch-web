import React from "react";
import { Table, Button, Space, Popconfirm, Tag } from "antd";
import { DeleteOutlined, StopOutlined, EyeOutlined } from "@ant-design/icons";
import { TaskExecutionEntity } from "../../../types/api";
import { ColumnsType } from "antd/es/table";
import { TablePaginationConfig } from "antd/es/table";

interface ExecutionTableProps {
  executions: TaskExecutionEntity[] | undefined;
  isLoading: boolean;
  onViewDetail: (execution: TaskExecutionEntity) => void;
  onCancel: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  pagination?: TablePaginationConfig;
  onChange?: (pagination: TablePaginationConfig) => void;
}

/**
 * 执行记录表格组件
 */
const ExecutionTable: React.FC<ExecutionTableProps> = ({
  executions,
  isLoading,
  onViewDetail,
  onCancel,
  onDelete,
  pagination,
  onChange,
}) => {
  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case "queued":
        return <Tag color="blue">排队中</Tag>;
      case "running":
        return <Tag color="processing">运行中</Tag>;
      case "completed":
        return <Tag color="success">已完成</Tag>;
      case "failed":
        return <Tag color="error">失败</Tag>;
      case "cancelled":
        return <Tag color="warning">已取消</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 表格列定义
  const columns: ColumnsType<TaskExecutionEntity> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "任务ID",
      dataIndex: "taskId",
      key: "taskId",
      width: 100,
    },
    {
      title: "服务器ID",
      dataIndex: "serverId",
      key: "serverId",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "退出码",
      dataIndex: "exitCode",
      key: "exitCode",
      width: 100,
      render: (exitCode: number | undefined) =>
        exitCode !== undefined ? exitCode : "-",
    },
    {
      title: "开始时间",
      dataIndex: "startedAt",
      key: "startedAt",
      width: 180,
      render: (startedAt: string | undefined) =>
        startedAt ? new Date(startedAt).toLocaleString() : "-",
    },
    {
      title: "完成时间",
      dataIndex: "completedAt",
      key: "completedAt",
      width: 180,
      render: (completedAt: string | undefined) =>
        completedAt ? new Date(completedAt).toLocaleString() : "-",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      width: 250,
      render: (_, record: TaskExecutionEntity) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onViewDetail(record)}>
            详情
          </Button>
          {(record.status === "queued" || record.status === "running") && (
            <Popconfirm
              title="确定要取消这个任务吗?"
              onConfirm={() => onCancel(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button icon={<StopOutlined />}>取消</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确定要删除这个执行记录吗?"
            onConfirm={() => onDelete(record.id)}
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

  return (
    <Table
      dataSource={executions}
      columns={columns}
      rowKey="id"
      loading={isLoading}
      scroll={{ x: "max-content" }}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default ExecutionTable;
