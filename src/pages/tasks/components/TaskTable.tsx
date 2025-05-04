import React from "react";
import { Table, Button, Space, Dropdown, Modal } from "antd";
import {
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { TaskEntity } from "../../../api/tasks";
import { ColumnsType } from "antd/es/table";
import { TablePaginationConfig } from "antd/es/table";
import { ID } from "../../../types/common";

interface TaskTableProps {
  tasks: TaskEntity[] | undefined;
  isLoading: boolean;
  onEdit: (task: TaskEntity) => void;
  onDelete: (id: ID) => void;
  onExecute: (id: ID) => void;
  onViewHistory: (id: ID) => void;
  pagination?: TablePaginationConfig;
  onChange?: (pagination: TablePaginationConfig) => void;
}

/**
 * 任务表格组件
 */
const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onExecute,
  onViewHistory,
  pagination,
  onChange,
}) => {
  // 处理删除确认
  const handleDeleteConfirm = (id: ID) => {
    Modal.confirm({
      title: "确定要删除这个任务吗?",
      onOk: () => onDelete(id),
      okText: "是",
      cancelText: "否",
    });
  };

  // 表格列定义
  const columns: ColumnsType<TaskEntity> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
      width: 100,
      render: (timeout: number | undefined) => timeout || "-",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record: TaskEntity) => (
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => onExecute(record.id)}
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
                  onClick: () => onEdit(record),
                },
                {
                  key: "history",
                  icon: <HistoryOutlined />,
                  label: "历史",
                  onClick: () => onViewHistory(record.id),
                },
                {
                  key: "delete",
                  icon: <DeleteOutlined />,
                  label: "删除",
                  danger: true,
                  onClick: () => handleDeleteConfirm(record.id),
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
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey="id"
      loading={isLoading}
      scroll={{ x: "max-content" }}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default TaskTable;
