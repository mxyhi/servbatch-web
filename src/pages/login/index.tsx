import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoginDto } from "../../api/auth";

const { Title } = Typography;

const Login: React.FC = () => {
  const { login, isLoggedIn, loading } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 如果已登录，重定向到首页
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 处理登录表单提交
  const handleSubmit = async (values: LoginDto) => {
    setSubmitting(true);
    try {
      const success = await login(values);
      if (success) {
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full flex flex-col md:flex-row">
        {/* 左侧背景区域 - 在中等屏幕及以上显示 */}
        <div className="hidden md:flex md:w-1/2 bg-primary justify-center items-center">
          <div className="text-white text-center p-8">
            <Title level={1} className="text-white mb-4">
              服务器批量管理系统
            </Title>
            <p className="text-xl text-gray-300">高效管理您的服务器和任务</p>
          </div>
        </div>

        {/* 右侧登录表单区域 */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
          <Card className="w-full max-w-md shadow-lg border-0">
            {/* 在小屏幕上显示标题 */}
            <div className="text-center mb-8 md:hidden">
              <Title level={2} className="mb-2">
                服务器批量管理系统
              </Title>
              <p className="text-gray-500">请登录以继续</p>
            </div>

            {/* 在中等屏幕及以上显示的标题 */}
            <div className="text-center mb-8 hidden md:block">
              <Title level={2} className="mb-2">
                欢迎登录
              </Title>
              <p className="text-gray-500">请输入您的账号和密码</p>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting}
                  className="h-12"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
