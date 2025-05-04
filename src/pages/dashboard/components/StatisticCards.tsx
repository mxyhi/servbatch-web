import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  CodeOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { SystemSummaryWithProxies } from "../../../types/api";

interface StatisticCardsProps {
  summary: SystemSummaryWithProxies | undefined;
}

/**
 * 统计卡片组件
 */
const StatisticCards: React.FC<StatisticCardsProps> = ({ summary }) => {
  if (!summary) {
    return null;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12} lg={4}>
        <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
          <Statistic
            title="服务器总数"
            value={summary.totalServers || 0}
            prefix={<CloudServerOutlined className="text-primary mr-1" />}
            valueStyle={{ color: "#1677ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={4}>
        <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
          <Statistic
            title="在线服务器"
            value={summary.onlineServers || 0}
            prefix={<CheckCircleOutlined className="text-success mr-1" />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={4}>
        <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
          <Statistic
            title="代理总数"
            value={summary.totalProxies || 0}
            prefix={<ApiOutlined className="text-primary mr-1" />}
            valueStyle={{ color: "#1677ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={4}>
        <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
          <Statistic
            title="在线代理"
            value={summary.onlineProxies || 0}
            prefix={<CheckCircleOutlined className="text-success mr-1" />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={4}>
        <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
          <Statistic
            title="任务总数"
            value={summary.totalTasks || 0}
            prefix={<CodeOutlined className="text-info mr-1" />}
            valueStyle={{ color: "#1677ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={4}>
        <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
          <Statistic
            title="今日执行次数"
            value={summary.executionsToday || 0}
            prefix={<ClockCircleOutlined className="text-warning mr-1" />}
            valueStyle={{ color: "#faad14" }}
            suffix={
              <span className="text-xs text-success">
                <ArrowUpOutlined /> {summary.successRate || 0}%
              </span>
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards;
