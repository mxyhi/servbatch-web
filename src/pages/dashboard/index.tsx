import React, { useEffect, useRef } from "react";
import { Card, Row, Col, Statistic, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard";
import * as echarts from "echarts";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  CodeOutlined,
  ApiOutlined,
} from "@ant-design/icons";

const Dashboard: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const serverStatusChartRef = useRef<HTMLDivElement>(null);
  const proxyStatusChartRef = useRef<HTMLDivElement>(null);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummaryWithProxies, // 使用包含代理信息的摘要API
  });

  const { data: serverStatus, isLoading: serverStatusLoading } = useQuery({
    queryKey: ["dashboard", "serverStatus"],
    queryFn: dashboardApi.getServerStatus,
  });

  const { data: taskStats, isLoading: taskStatsLoading } = useQuery({
    queryKey: ["dashboard", "taskStats"],
    queryFn: dashboardApi.getTaskStats,
  });

  const { data: proxyStatus, isLoading: proxyStatusLoading } = useQuery({
    queryKey: ["dashboard", "proxyStatus"],
    queryFn: dashboardApi.getProxyStatus,
  });

  // 处理窗口大小变化，重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (
        chartRef.current &&
        serverStatusChartRef.current &&
        proxyStatusChartRef.current
      ) {
        const charts = [
          echarts.getInstanceByDom(chartRef.current),
          echarts.getInstanceByDom(serverStatusChartRef.current),
          echarts.getInstanceByDom(proxyStatusChartRef.current),
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

  // 初始化代理状态图表
  useEffect(() => {
    if (proxyStatus && proxyStatusChartRef.current) {
      const chart = echarts.init(proxyStatusChartRef.current);

      const onlineCount = proxyStatus.filter(
        (proxy) => proxy.status === "online"
      ).length;
      const offlineCount = proxyStatus.filter(
        (proxy) => proxy.status === "offline"
      ).length;

      const option = {
        title: {
          text: "代理状态",
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
            name: "代理状态",
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
            ],
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [proxyStatus]);

  if (
    summaryLoading ||
    serverStatusLoading ||
    taskStatsLoading ||
    proxyStatusLoading
  ) {
    return (
      <Spin size="large" className="flex justify-center items-center h-full" />
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ height: "100%" }}>
      <Typography.Title level={2} className="mb-6">
        系统仪表盘
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={4}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="服务器总数"
              value={summary?.totalServers || 0}
              prefix={<CloudServerOutlined className="text-primary mr-1" />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={4}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="在线服务器"
              value={summary?.onlineServers || 0}
              prefix={<CheckCircleOutlined className="text-success mr-1" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={4}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="代理总数"
              value={summary?.totalProxies || 0}
              prefix={<ApiOutlined className="text-primary mr-1" />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={4}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="在线代理"
              value={summary?.onlineProxies || 0}
              prefix={<CheckCircleOutlined className="text-success mr-1" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={4}>
          <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
            <Statistic
              title="任务总数"
              value={summary?.totalTasks || 0}
              prefix={<CodeOutlined className="text-info mr-1" />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={4}>
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
        <Col xs={24} lg={8}>
          <Card
            title="任务执行统计"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer h-full"
          >
            <div ref={chartRef} className="w-full h-[300px]" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="服务器状态"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer h-full"
          >
            <div ref={serverStatusChartRef} className="w-full h-[300px]" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="代理状态"
            className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer h-full"
          >
            <div ref={proxyStatusChartRef} className="w-full h-[300px]" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
