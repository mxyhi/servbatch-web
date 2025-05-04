import React from "react";
import { Select, Button, Dropdown } from "antd";
import {
  ClearOutlined,
  CalendarOutlined,
  FilterOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TaskEntity, ServerEntity } from "../../../types/api";

interface ExecutionFiltersProps {
  tasks: TaskEntity[] | undefined;
  servers: ServerEntity[] | undefined;
  filterTaskId: number | null;
  filterServerId: number | null;
  onTaskFilterChange: (value: number | null) => void;
  onServerFilterChange: (value: number | null) => void;
  onResetFilters: () => void;
  onShowCleanupByDateModal: () => void;
  onShowCleanupByStatusModal: () => void;
  onCleanupByTaskId: (taskId: number) => void;
  onCleanupByServerId: (serverId: number) => void;
}

/**
 * 执行记录筛选组件
 */
const ExecutionFilters: React.FC<ExecutionFiltersProps> = ({
  tasks,
  servers,
  filterTaskId,
  filterServerId,
  onTaskFilterChange,
  onServerFilterChange,
  onResetFilters,
  onShowCleanupByDateModal,
  onShowCleanupByStatusModal,
  onCleanupByTaskId,
  onCleanupByServerId,
}) => {
  // 清理菜单项
  const cleanupMenuItems = [
    {
      key: "byDate",
      icon: <CalendarOutlined />,
      label: "按日期范围清理",
      onClick: onShowCleanupByDateModal,
    },
    {
      key: "byStatus",
      icon: <FilterOutlined />,
      label: "按状态清理",
      onClick: onShowCleanupByStatusModal,
    },
    ...(filterTaskId
      ? [
          {
            key: "byTask",
            icon: <DeleteOutlined />,
            label: "清理当前任务所有记录",
            danger: true,
            onClick: () => onCleanupByTaskId(filterTaskId),
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
            onClick: () => onCleanupByServerId(filterServerId),
          },
        ]
      : []),
  ];

  return (
    <div className="flex space-x-4">
      <Select
        style={{ width: 200 }}
        placeholder="按任务筛选"
        allowClear
        onChange={onTaskFilterChange}
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
        onChange={onServerFilterChange}
        value={filterServerId}
      >
        {servers?.map((server) => (
          <Select.Option key={server.id} value={server.id}>
            {server.name}
          </Select.Option>
        ))}
      </Select>
      {(filterTaskId || filterServerId) && (
        <Button onClick={onResetFilters}>重置筛选</Button>
      )}
      <Dropdown menu={{ items: cleanupMenuItems }}>
        <Button icon={<ClearOutlined />}>清理记录</Button>
      </Dropdown>
    </div>
  );
};

export default ExecutionFilters;
