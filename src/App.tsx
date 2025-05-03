import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";

// 布局组件
import MainLayout from "./components/layout/MainLayout";

// 页面组件
import Dashboard from "./pages/dashboard";
import Servers from "./pages/servers";
import Tasks from "./pages/tasks";
import Executions from "./pages/executions";
import CommandMonitors from "./pages/commandMonitors";

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
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="servers" element={<Servers />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="executions" element={<Executions />} />
              <Route path="command-monitors" element={<CommandMonitors />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
