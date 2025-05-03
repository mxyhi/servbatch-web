import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Button, Typography } from "antd";
import {
  DashboardOutlined,
  CloudServerOutlined,
  CodeOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 监听窗口大小变化，自动调整布局
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: "/servers",
      icon: <CloudServerOutlined />,
      label: <Link to="/servers">服务器管理</Link>,
    },
    {
      key: "/tasks",
      icon: <CodeOutlined />,
      label: <Link to="/tasks">任务管理</Link>,
    },
    {
      key: "/executions",
      icon: <HistoryOutlined />,
      label: <Link to="/executions">执行记录</Link>,
    },
    {
      key: "/command-monitors",
      icon: <MonitorOutlined />,
      label: <Link to="/command-monitors">命令监控</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="shadow-md transition-all duration-300 ease-in-out"
        breakpoint="md"
        width={220}
      >
        <div className="py-4 px-4 h-16 flex items-center justify-center">
          {!collapsed && (
            <Title level={4} className="m-0 text-primary">
              服务器管理系统
            </Title>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              S
            </div>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-0"
        />
      </Sider>

      <Layout>
        <Content
          className="m-4 md:m-6"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="p-4 md:p-6 min-h-[360px]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
