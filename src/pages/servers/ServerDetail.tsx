import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Descriptions,
  Spin,
  Tabs,
  Space,
  Statistic,
  Progress,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  DesktopOutlined,
  CodeOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { serversApi, ServerDetails, ServerResources } from "../../api/servers";
import ServerTerminal from "./components/ServerTerminal";
import ServerResourceMonitor from "./components/ServerResourceMonitor";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { message } from "../../utils/message";

const { Title, Text } = Typography;

/**
 * 服务器详情页面
 */
const ServerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  // 自动刷新设置
  const { autoRefresh, setAutoRefresh, refresh } = useAutoRefresh({
    defaultInterval: 5000,
    refreshOnMount: true,
  });

  // 获取服务器详情
  const {
    data: serverDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ["server", "details", id],
    queryFn: () => serversApi.getServerDetails(id!),
    enabled: !!id,
    refetchInterval: activeTab === "info" && autoRefresh ? 5000 : false,
  });

  // 获取服务器资源使用情况
  const {
    data: serverResources,
    isLoading: isLoadingResources,
    error: resourcesError,
    refetch: refetchResources,
  } = useQuery({
    queryKey: ["server", "resources", id],
    queryFn: () => serversApi.getServerResources(id!),
    enabled: !!id && activeTab === "resources",
    refetchInterval: activeTab === "resources" && autoRefresh ? 5000 : false,
  });

  // 格式化运行时间
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let result = "";
    if (days > 0) {
      result += `${days}天 `;
    }
    if (hours > 0 || days > 0) {
      result += `${hours}小时 `;
    }
    result += `${minutes}分钟`;

    return result;
  };

  // 处理手动刷新
  const handleRefresh = () => {
    if (activeTab === "info") {
      refetchDetails();
    } else if (activeTab === "resources") {
      refetchResources();
    }
    refresh();
  };

  // 处理返回按钮点击
  const handleBack = () => {
    navigate("/servers");
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "resources") {
      refetchResources();
    }
  };

  // 定义标签页内容
  const tabItems = [
    {
      key: "info",
      label: (
        <span>
          <DesktopOutlined />
          基本信息
        </span>
      ),
      children: (
        <>
          {serverDetails && (
            <Card>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="ID">
                  {serverDetails.id}
                </Descriptions.Item>
                <Descriptions.Item label="名称">
                  {serverDetails.name}
                </Descriptions.Item>
                <Descriptions.Item label="主机地址">
                  {serverDetails.host}
                </Descriptions.Item>
                <Descriptions.Item label="SSH端口">
                  {serverDetails.port}
                </Descriptions.Item>
                <Descriptions.Item label="用户名">
                  {serverDetails.username}
                </Descriptions.Item>
                <Descriptions.Item label="连接类型">
                  {serverDetails.connectionType === "direct" ? "直连" : "代理"}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  {serverDetails.status === "online"
                    ? "在线"
                    : serverDetails.status === "offline"
                    ? "离线"
                    : "未知"}
                </Descriptions.Item>
                <Descriptions.Item label="最后检查时间">
                  {serverDetails.lastChecked
                    ? new Date(serverDetails.lastChecked).toLocaleString()
                    : "未检查"}
                </Descriptions.Item>
                <Descriptions.Item label="开机时间">
                  {serverDetails.bootTime
                    ? new Date(serverDetails.bootTime).toLocaleString()
                    : "未知"}
                </Descriptions.Item>
                <Descriptions.Item label="运行时间">
                  {serverDetails.uptime
                    ? formatUptime(serverDetails.uptime)
                    : "未知"}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {new Date(serverDetails.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {new Date(serverDetails.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </>
      ),
    },
    {
      key: "resources",
      label: (
        <span>
          <DashboardOutlined />
          资源监控
        </span>
      ),
      children: (
        <ServerResourceMonitor
          resources={serverResources}
          isLoading={isLoadingResources}
          error={resourcesError}
          onRefresh={refetchResources}
        />
      ),
    },
    {
      key: "terminal",
      label: (
        <span>
          <CodeOutlined />
          终端
        </span>
      ),
      children: (
        <>
          {serverDetails && (
            <ServerTerminal
              serverId={serverDetails.id}
              serverName={serverDetails.name}
              serverStatus={serverDetails.status}
            />
          )}
        </>
      ),
    },
  ];

  // 加载中状态
  if (isLoadingDetails && !serverDetails) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  // 错误状态
  if (detailsError) {
    return (
      <Alert
        message="加载失败"
        description={`无法加载服务器详情: ${
          detailsError instanceof Error ? detailsError.message : "未知错误"
        }`}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => refetchDetails()}>
            重试
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <div className="flex justify-between items-center">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mr-2"
          >
            返回
          </Button>
          <Title level={4} className="m-0">
            {serverDetails?.name || "服务器详情"}
          </Title>
          {serverDetails?.status && (
            <Text
              className={`px-2 py-1 rounded-full text-white ${
                serverDetails.status === "online"
                  ? "bg-green-500"
                  : serverDetails.status === "offline"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {serverDetails.status === "online"
                ? "在线"
                : serverDetails.status === "offline"
                ? "离线"
                : "未知"}
            </Text>
          )}
        </Space>
        <Space>
          <Button onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? "停止自动刷新" : "自动刷新"}
          </Button>
          <Button onClick={handleRefresh} loading={isLoadingDetails}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 标签页 */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </div>
  );
};

export default ServerDetail;
