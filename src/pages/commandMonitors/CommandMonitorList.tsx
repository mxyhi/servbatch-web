import React, { useCallback } from "react";
import {
  Button,
  Space,
  Tag,
  Popconfirm,
  TablePaginationConfig,
  Dropdown,
  Modal,
} from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { EditButton, ActionGroup } from "../../components/common";
import { CommandMonitorEntity } from "../../types/api";
import { EntityTable } from "../../components/entity";

interface CommandMonitorListProps {
  monitors?: CommandMonitorEntity[];
  isLoading: boolean;
  onEdit: (monitor: CommandMonitorEntity) => void;
  onViewHistory: (monitorId: string | number) => void;
  onEnable: (monitorId: string | number) => void;
  onDisable: (monitorId: string | number) => void;
  onDelete: (monitorId: string | number) => void;
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
      width: 150,
      render: (_: any, record: CommandMonitorEntity) => (
        <ActionGroup>
          <EditButton onClick={() => onEdit(record)} size="small" />
          <Dropdown
            menu={{
              items: [
                {
                  key: "history",
                  icon: <HistoryOutlined />,
                  label: "历史",
                  onClick: () => onViewHistory(record.id),
                },
                record.enabled
                  ? {
                      key: "disable",
                      icon: <StopOutlined />,
                      label: "禁用",
                      onClick: () => {
                        // 使用Modal.confirm替代Popconfirm，保持一致的用户体验
                        Modal.confirm({
                          title: "确定要禁用这个监控吗?",
                          onOk: () => onDisable(record.id),
                          okText: "是",
                          cancelText: "否",
                        });
                      },
                    }
                  : {
                      key: "enable",
                      icon: <CheckCircleOutlined />,
                      label: "启用",
                      onClick: () => {
                        Modal.confirm({
                          title: "确定要启用这个监控吗?",
                          onOk: () => onEnable(record.id),
                          okText: "是",
                          cancelText: "否",
                        });
                      },
                    },
                {
                  key: "delete",
                  icon: <DeleteOutlined />,
                  label: "删除",
                  danger: true,
                  onClick: () => {
                    Modal.confirm({
                      title: "确定要删除这个监控吗?",
                      onOk: () => onDelete(record.id),
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
        </ActionGroup>
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
