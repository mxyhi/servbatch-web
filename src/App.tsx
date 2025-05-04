import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Form, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";

// 布局组件
import MainLayout from "./components/layout/MainLayout";

// 全局消息服务
import { GlobalMessageProvider } from "./utils/message";

// 认证组件
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// 页面组件
import Dashboard from "./pages/dashboard";
import Servers from "./pages/servers";
import Tasks from "./pages/tasks";
import Executions from "./pages/executions";
import CommandMonitors from "./pages/commandMonitors";
import Proxies from "./pages/proxies";
import Users from "./pages/users";
import Login from "./pages/login";

// 自定义主题配置
const customTheme = {
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Button: {
      colorPrimary: "#1677ff",
      algorithm: true,
    },
    Card: {
      colorBgContainer: "#ffffff",
    },
  },
};

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN} theme={customTheme} componentSize="middle">
        {/* 使用 AntApp 组件包装整个应用，提供全局消息服务 */}
        <AntApp>
          {/* 初始化全局消息服务 */}
          <GlobalMessageProvider />
          {/* 使用 Form.Provider 包装整个应用，解决 useForm 警告 */}
          <Form.Provider>
            <HashRouter>
              <AuthProvider>
                <Routes>
                  {/* 公共路由 */}
                  <Route path="/login" element={<Login />} />

                  {/* 受保护路由 */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="servers" element={<Servers />} />
                      <Route path="tasks" element={<Tasks />} />
                      <Route path="executions" element={<Executions />} />
                      <Route
                        path="command-monitors"
                        element={<CommandMonitors />}
                      />
                      <Route path="proxies" element={<Proxies />} />
                      <Route path="users" element={<Users />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Route>
                </Routes>
              </AuthProvider>
            </HashRouter>
          </Form.Provider>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
