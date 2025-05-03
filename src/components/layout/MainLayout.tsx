import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  theme,
  Button,
  Typography,
  Dropdown,
  Avatar,
  Space,
} from "antd";
import {
  DashboardOutlined,
  CloudServerOutlined,
  CodeOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MonitorOutlined,
  ApiOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
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
      key: "/proxies",
      icon: <ApiOutlined />,
      label: <Link to="/proxies">代理管理</Link>,
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
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">用户管理</Link>,
    },
  ];

  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="shadow-md transition-all duration-300 ease-in-out h-screen overflow-y-auto"
        breakpoint="md"
        width={220}
      >
        <div className="flex flex-col h-full">
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
            className="border-0 flex-1 overflow-y-auto"
          />
        </div>
      </Sider>

      <Layout className="flex flex-col overflow-auto h-full">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          className="flex justify-between items-center px-4 shadow-sm sticky top-0 z-10"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />

          <div className="flex items-center">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: "个人信息",
                  },
                  {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: "设置",
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "退出登录",
                    onClick: logout,
                  },
                ],
              }}
            >
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span className="hidden md:inline">
                  {user?.username || "用户"}
                </span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content
          className="m-4 md:m-6 flex-1 flex flex-col overflow-auto"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="p-4 md:p-6 flex-1 flex flex-col">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
