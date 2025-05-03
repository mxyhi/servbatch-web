import React, { useRef } from "react";
import { Card, Row, Col, Spin, Typography } from "antd";

// 导入自定义Hook
import { useDashboardData } from "./hooks/useDashboardData";
import { useChartResize } from "./hooks/useChartResize";

// 导入组件
import StatisticCards from "./components/StatisticCards";
import TaskExecutionChart from "./components/TaskExecutionChart";
import ServerStatusChart from "./components/ServerStatusChart";
import ProxyStatusChart from "./components/ProxyStatusChart";

/**
 * 仪表盘页面组件
 */
const Dashboard: React.FC = () => {
  // 图表引用
  const taskChartRef = useRef<HTMLDivElement>(null);
  const serverChartRef = useRef<HTMLDivElement>(null);
  const proxyChartRef = useRef<HTMLDivElement>(null);

  // 使用自定义Hook获取数据
  const { summary, serverStatus, taskStats, proxyStatus, isLoading } =
    useDashboardData();

  // 使用自定义Hook处理图表大小调整
  useChartResize([taskChartRef, serverChartRef, proxyChartRef]);

  // 加载中状态
  if (isLoading) {
    return (
      <Spin size="large" className="flex justify-center items-center h-full" />
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ height: "100%" }}>
      <Typography.Title level={2} className="mb-6">
        系统仪表盘
      </Typography.Title>

      {/* 统计卡片 */}
      <StatisticCards summary={summary} />

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={8}>
          <Card
            title="任务执行统计"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer h-full"
          >
            {taskStats && (
              <TaskExecutionChart
                successfulExecutions={taskStats.successfulExecutions}
                failedExecutions={taskStats.failedExecutions}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="服务器状态"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer h-full"
          >
            <ServerStatusChart serverStatus={serverStatus} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="代理状态"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer h-full"
          >
            <ProxyStatusChart proxyStatus={proxyStatus} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
