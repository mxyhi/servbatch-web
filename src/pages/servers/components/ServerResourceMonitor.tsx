import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Statistic,
  Spin,
  Alert,
  Button,
  Divider,
  Empty,
} from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  HddOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ServerResources } from "../../../api/servers";

const { Text } = Typography;

interface ServerResourceMonitorProps {
  resources: ServerResources | undefined;
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
}

/**
 * 服务器资源监控组件
 */
const ServerResourceMonitor: React.FC<ServerResourceMonitorProps> = ({
  resources,
  isLoading,
  error,
  onRefresh,
}) => {
  // 格式化内存大小
  const formatMemory = (mb: number) => {
    if (mb < 1024) {
      return `${mb.toFixed(0)} MB`;
    } else {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
  };

  // 错误状态
  if (error) {
    return (
      <Alert
        message="加载失败"
        description={`无法加载资源使用情况: ${
          error instanceof Error ? error.message : "未知错误"
        }`}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={onRefresh}>
            重试
          </Button>
        }
      />
    );
  }

  // 加载中状态
  if (isLoading && !resources) {
    return (
      <div className="flex justify-center items-center p-10">
        <Spin size="large" />
      </div>
    );
  }

  // 无数据状态
  if (!resources) {
    return (
      <Empty
        description="暂无资源使用数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={onRefresh} icon={<ReloadOutlined />}>
          刷新
        </Button>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      <Row gutter={[16, 16]}>
        {/* CPU使用情况 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center">
                <DashboardOutlined className="mr-2" />
                <span>CPU使用情况</span>
              </div>
            }
            className="h-full"
          >
            <div className="text-center mb-4">
              <Progress
                type="dashboard"
                percent={Math.round(resources.cpu.usage)}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": resources.cpu.usage > 80 ? "#ff4d4f" : "#87d068",
                }}
                format={(percent) => `${percent}%`}
              />
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="CPU核心数"
                  value={resources.cpu.cores}
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="平均负载"
                  value={resources.cpu.loadAverage[0].toFixed(2)}
                  suffix={`/ ${resources.cpu.loadAverage[1].toFixed(
                    2
                  )} / ${resources.cpu.loadAverage[2].toFixed(2)}`}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 内存使用情况 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center">
                <DatabaseOutlined className="mr-2" />
                <span>内存使用情况</span>
              </div>
            }
            className="h-full"
          >
            <div className="text-center mb-4">
              <Progress
                type="dashboard"
                percent={Math.round(resources.memory.usage)}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": resources.memory.usage > 80 ? "#ff4d4f" : "#87d068",
                }}
                format={(percent) => `${percent}%`}
              />
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总内存"
                  value={formatMemory(resources.memory.total)}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="已用内存"
                  value={formatMemory(resources.memory.used)}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="空闲内存"
                  value={formatMemory(resources.memory.free)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* GPU使用情况 */}
      {resources.gpu && resources.gpu.length > 0 && (
        <>
          <Divider orientation="left">GPU使用情况</Divider>
          <Row gutter={[16, 16]}>
            {resources.gpu.map((gpu) => (
              <Col xs={24} md={12} key={gpu.index}>
                <Card
                  title={
                    <div className="flex items-center">
                      <HddOutlined className="mr-2" />
                      <span>
                        {gpu.name} (GPU {gpu.index})
                      </span>
                    </div>
                  }
                  className="h-full"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="text-center mb-4">
                        <Progress
                          type="dashboard"
                          percent={Math.round(gpu.usage)}
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": gpu.usage > 80 ? "#ff4d4f" : "#87d068",
                          }}
                          format={(percent) => `${percent}%`}
                        />
                        <div className="mt-2">GPU使用率</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="text-center mb-4">
                        <Progress
                          type="dashboard"
                          percent={Math.round(gpu.memory.usage)}
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%":
                              gpu.memory.usage > 80 ? "#ff4d4f" : "#87d068",
                          }}
                          format={(percent) => `${percent}%`}
                        />
                        <div className="mt-2">显存使用率</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="总显存"
                        value={formatMemory(gpu.memory.total)}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="已用显存"
                        value={formatMemory(gpu.memory.used)}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="温度"
                        value={gpu.temperature}
                        suffix="°C"
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <div className="text-right text-gray-500">
        <Text type="secondary">
          数据更新时间: {new Date(resources.timestamp).toLocaleString()}
        </Text>
      </div>
    </div>
  );
};

export default ServerResourceMonitor;
