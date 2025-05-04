import React, { useCallback } from "react";
import { Button, Space, Tag, Popconfirm, TablePaginationConfig } from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { CommandMonitorEntity } from "../../api/commandMonitors";
import { EntityTable } from "../../components/entity";

interface CommandMonitorListProps {
  monitors?: CommandMonitorEntity[];
  isLoading: boolean;
  onEdit: (monitor: CommandMonitorEntity) => void;
  onViewHistory: (monitorId: number) => void;
  onEnable: (monitorId: number) => void;
  onDisable: (monitorId: number) => void;
  onDelete: (monitorId: number) => void;
  servers?: any[];
  // 分页相关
  pagination?: TablePaginationConfig;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: any
  ) => void;
}

/**
 * 命令监控列表组件
 */
const CommandMonitorList: React.FC<CommandMonitorListProps> = ({
  monitors = [],
  isLoading,
  onEdit,
  onViewHistory,
  onEnable,
  onDisable,
  onDelete,
  servers = [],
  pagination,
  onChange,
}) => {
  // 获取服务器名称
  const getServerName = useCallback(
    (serverId: number) => {
      const server = servers.find((s) => s.id === serverId);
      return server ? server.name : serverId;
    },
    [servers]
  );

  // 表格列定义
  const columns = [
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
    },
    {
      title: "检查命令",
      dataIndex: "checkCommand",
      key: "checkCommand",
      ellipsis: true,
    },
    {
      title: "执行命令",
      dataIndex: "executeCommand",
      key: "executeCommand",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled: boolean) =>
        enabled ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            已启用
          </Tag>
        ) : (
          <Tag color="error" icon={<StopOutlined />}>
            已禁用
          </Tag>
        ),
    },
    {
      title: "服务器",
      dataIndex: "serverId",
      key: "serverId",
      render: (serverId: number) => getServerName(serverId),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: CommandMonitorEntity) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => onViewHistory(record.id)}
          >
            历史
          </Button>
          {record.enabled ? (
            <Popconfirm
              title="确定要禁用这个监控吗?"
              onConfirm={() => onDisable(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button icon={<StopOutlined />}>禁用</Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定要启用这个监控吗?"
              onConfirm={() => onEnable(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button type="primary" icon={<CheckCircleOutlined />}>
                启用
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确定要删除这个监控吗?"
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
    <EntityTable
      entities={monitors}
      isLoading={isLoading}
      columns={columns}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default React.memo(CommandMonitorList);
