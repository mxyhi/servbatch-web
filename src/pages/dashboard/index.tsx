import React, { useEffect, useRef } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard";
import { TaskExecutionEntity } from "../../api/executions";
import * as echarts from "echarts";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  CodeOutlined,
} from "@ant-design/icons";

const Dashboard: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const serverStatusChartRef = useRef<HTMLDivElement>(null);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
  });

  const { data: recentExecutions, isLoading: executionsLoading } = useQuery({
    queryKey: ["dashboard", "recentExecutions"],
    queryFn: () => dashboardApi.getRecentExecutions(10),
  });

  const { data: serverStatus, isLoading: serverStatusLoading } = useQuery({
    queryKey: ["dashboard", "serverStatus"],
    queryFn: dashboardApi.getServerStatus,
  });

  const { data: taskStats, isLoading: taskStatsLoading } = useQuery({
    queryKey: ["dashboard", "taskStats"],
    queryFn: dashboardApi.getTaskStats,
  });

  // 处理窗口大小变化，重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && serverStatusChartRef.current) {
        const charts = [
          echarts.getInstanceByDom(chartRef.current),
          echarts.getInstanceByDom(serverStatusChartRef.current),
        ];

        charts.forEach((chart) => {
          if (chart) {
            chart.resize();
          }
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (taskStats && chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: "任务执行统计",
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "bottom",
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12,
          },
        },
        color: ["#52c41a", "#ff4d4f"],
        series: [
          {
            name: "执行结果",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: taskStats.successfulExecutions, name: "成功" },
              { value: taskStats.failedExecutions, name: "失败" },
            ],
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [taskStats]);

  useEffect(() => {
    if (serverStatus && serverStatusChartRef.current) {
      const chart = echarts.init(serverStatusChartRef.current);

      const onlineCount = serverStatus.filter(
        (server) => server.status === "online"
      ).length;
      const offlineCount = serverStatus.filter(
        (server) => server.status === "offline"
      ).length;
      const unknownCount = serverStatus.filter(
        (server) => server.status === "unknown"
      ).length;

      const option = {
        title: {
          text: "服务器状态",
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "bottom",
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12,
          },
        },
        color: ["#52c41a", "#ff4d4f", "#faad14"],
        series: [
          {
            name: "服务器状态",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: onlineCount, name: "在线" },
              { value: offlineCount, name: "离线" },
              { value: unknownCount, name: "未知" },
            ],
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [serverStatus]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "任务ID",
      dataIndex: "taskId",
      key: "taskId",
    },
    {
      title: "服务器ID",
      dataIndex: "serverId",
      key: "serverId",
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
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  if (
    summaryLoading ||
    executionsLoading ||
    serverStatusLoading ||
    taskStatsLoading
  ) {
    return (
      <Spin size="large" className="flex justify-center items-center h-full" />
    );
  }

  return (
    <div>
      <Typography.Title level={2} className="mb-6">
        系统仪表盘
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="服务器总数"
              value={summary?.totalServers || 0}
              prefix={<CloudServerOutlined className="text-primary mr-1" />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="在线服务器"
              value={summary?.onlineServers || 0}
              prefix={<CheckCircleOutlined className="text-success mr-1" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="任务总数"
              value={summary?.totalTasks || 0}
              prefix={<CodeOutlined className="text-info mr-1" />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="今日执行次数"
              value={summary?.executionsToday || 0}
              prefix={<ClockCircleOutlined className="text-warning mr-1" />}
              valueStyle={{ color: "#faad14" }}
              suffix={
                <span className="text-xs text-success">
                  <ArrowUpOutlined /> {summary?.successRate || 0}%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card
            title="任务执行统计"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
          >
            <div ref={chartRef} className="w-full h-[300px]" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="服务器状态"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
          >
            <div ref={serverStatusChartRef} className="w-full h-[300px]" />
          </Card>
        </Col>
      </Row>

      <Card
        title="最近执行记录"
        className="mt-6 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
      >
        <Table
          dataSource={recentExecutions}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="overflow-x-auto"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
