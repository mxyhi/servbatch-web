import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined, ImportOutlined, SyncOutlined } from "@ant-design/icons";
import { PageHeader, AutoRefreshToggle } from "../../../components/common";

interface ServerHeaderProps {
  // 自动刷新状态
  autoRefresh: boolean;

  // 加载状态
  isLoading?: boolean;

  // 回调函数
  onRefreshChange: (checked: boolean) => void;
  onAddServer: () => void;
  onImportServers: () => void;
  onRefresh: () => void;
}

/**
 * 服务器管理页面头部组件
 *
 * 包含标题、自动刷新开关、操作按钮等
 */
const ServerHeader: React.FC<ServerHeaderProps> = ({
  autoRefresh,
  isLoading = false,
  onRefreshChange,
  onAddServer,
  onImportServers,
  onRefresh,
}) => {
  return (
    <PageHeader
      title="服务器管理"
      extra={
        <Space>
          <AutoRefreshToggle
            autoRefresh={autoRefresh}
            onChange={onRefreshChange}
            showLabel={false}
          />
          <Button
            icon={<SyncOutlined />}
            onClick={onRefresh}
            loading={isLoading}
          >
            刷新
          </Button>
          <Button icon={<ImportOutlined />} onClick={onImportServers}>
            批量导入
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddServer}>
            添加服务器
          </Button>
        </Space>
      }
    />
  );
};

export default React.memo(ServerHeader);
