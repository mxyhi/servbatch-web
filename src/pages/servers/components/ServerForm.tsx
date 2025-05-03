import React, { useMemo } from "react";
import { Form, Input, InputNumber, Select, FormInstance, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ConnectionType } from "../../../constants";

interface ServerFormProps {
  form: FormInstance;
}

/**
 * 服务器表单组件
 *
 * 用于创建和编辑服务器的表单字段
 */
const ServerForm: React.FC<ServerFormProps> = ({ form }) => {
  // 表单验证规则
  const rules = useMemo(
    () => ({
      name: [
        { required: true, message: "请输入服务器名称" },
        { max: 50, message: "服务器名称不能超过50个字符" },
      ],
      host: [
        { required: true, message: "请输入主机地址" },
        {
          pattern:
            /^[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9]$|^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
          message: "请输入有效的主机名或IP地址",
        },
      ],
      port: [
        { required: true, message: "请输入SSH端口" },
        {
          type: "number",
          min: 1,
          max: 65535,
          message: "端口号必须在1-65535之间",
        },
      ],
      username: [
        { required: true, message: "请输入用户名" },
        { max: 30, message: "用户名不能超过30个字符" },
      ],
      connectionType: [{ required: true, message: "请选择连接类型" }],
    }),
    []
  );

  // 代理服务器ID验证规则
  const proxyIdValidator = (_, value: string) => {
    const connectionType = form.getFieldValue("connectionType");
    if (connectionType !== ConnectionType.PROXY || value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请输入代理服务器ID"));
  };

  return (
    <>
      <Form.Item
        name="name"
        label="服务器名称"
        rules={rules.name}
        tooltip="服务器的显示名称，用于标识不同的服务器"
      >
        <Input placeholder="例如：测试服务器" maxLength={50} showCount />
      </Form.Item>

      <Form.Item
        name="host"
        label="主机地址"
        rules={rules.host}
        tooltip="服务器的IP地址或域名"
      >
        <Input placeholder="例如：192.168.1.1 或 server.example.com" />
      </Form.Item>

      <Form.Item
        name="port"
        label="SSH端口"
        initialValue={22}
        rules={rules.port}
        tooltip="SSH服务的端口号，默认为22"
      >
        <InputNumber min={1} max={65535} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="username"
        label="用户名"
        rules={rules.username}
        tooltip="SSH登录用户名"
      >
        <Input placeholder="例如：root" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        tooltip={{
          title: "SSH登录密码，如果使用密钥认证，可以留空",
          icon: <InfoCircleOutlined />,
        }}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        name="connectionType"
        label="连接类型"
        initialValue={ConnectionType.DIRECT}
        rules={rules.connectionType}
        tooltip="选择直连或通过代理服务器连接"
      >
        <Select>
          <Select.Option value={ConnectionType.DIRECT}>直连</Select.Option>
          <Select.Option value={ConnectionType.PROXY}>代理</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.connectionType !== currentValues.connectionType
        }
      >
        {({ getFieldValue }) => {
          const connectionType = getFieldValue("connectionType");
          return (
            <Form.Item
              name="proxyId"
              label="代理服务器ID"
              tooltip="如果选择代理连接，请输入代理服务器ID"
              rules={[{ validator: proxyIdValidator }]}
              hidden={connectionType !== ConnectionType.PROXY}
            >
              <Input placeholder="请输入代理服务器ID" />
            </Form.Item>
          );
        }}
      </Form.Item>

      <Form.Item
        name="privateKey"
        label="私钥"
        tooltip={{
          title: "SSH私钥内容，如果使用密码认证，可以留空",
          icon: <InfoCircleOutlined />,
        }}
      >
        <Input.TextArea
          rows={4}
          placeholder="-----BEGIN RSA PRIVATE KEY-----..."
        />
      </Form.Item>
    </>
  );
};

export default React.memo(ServerForm);
