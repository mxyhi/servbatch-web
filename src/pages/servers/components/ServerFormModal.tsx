import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, FormInstance } from "antd";
import {
  ServerEntity,
  UpdateServerDto,
  CreateServerDto,
  ProxyEntity, // Import ProxyEntity from global types
} from "../../../types/api"; // Update import path
// Remove ProxyEntity import from ../../../api/proxies
import { UseMutationResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ID } from "../../../types/common"; // Import ID type
import { DEFAULT_PAGE_SIZE } from "../../../constants";
import { FormModal } from "../../../components/common";
import { proxiesApi } from "../../../api/proxies";

interface ServerFormModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  editingServer: ServerEntity | null;
  setEditingServer: (server: ServerEntity | null) => void;
  createMutation: UseMutationResult<
    ServerEntity,
    Error,
    CreateServerDto,
    unknown
  >;
  updateMutation: UseMutationResult<
    ServerEntity,
    Error,
    { id: ID; data: UpdateServerDto }, // Change id type to ID
    unknown
  >;
  form?: FormInstance;
}

const ServerFormModal: React.FC<ServerFormModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  editingServer,
  setEditingServer,
  createMutation,
  updateMutation,
  form: externalForm,
}) => {
  // 使用外部传入的表单实例或创建新的表单实例
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  // 获取当前连接类型
  const connectionType = Form.useWatch("connectionType", form) || "direct";

  // 获取代理列表 (使用分页接口)
  const { data: proxies = [] } = useQuery({
    // Keep default empty array
    queryKey: ["proxies", { page: 1, pageSize: DEFAULT_PAGE_SIZE }], // 使用默认页面大小
    queryFn: () =>
      proxiesApi.getProxiesPaginated({ page: 1, pageSize: DEFAULT_PAGE_SIZE }), // 使用默认页面大小
    select: (data) => data.items, // Select only the items array
    // 只有在代理连接模式下才获取代理列表
    enabled: connectionType === "proxy" && isModalVisible,
  });

  // 设置默认连接类型和初始化表单
  useEffect(() => {
    if (!editingServer && isModalVisible) {
      // 如果是新建模式，设置默认值
      form.setFieldsValue({
        connectionType: "direct",
        port: 22,
      });
    }
  }, [form, editingServer, isModalVisible]);

  useEffect(() => {
    if (editingServer) {
      form.setFieldsValue({
        name: editingServer.name,
        host: editingServer.host,
        port: editingServer.port,
        username: editingServer.username,
        connectionType: editingServer.connectionType,
        proxyId: editingServer.proxyId,
        // privateKey is not available on ServerEntity for reading
        // The form field will be populated only if user enters it or via password manager etc.
        // Clear it explicitly if needed when editing, or rely on form.resetFields on cancel/close
      });
      // If password/privateKey needs special handling on edit (e.g., showing placeholder instead of value),
      // add logic here or within the form items themselves.
    }
  }, [editingServer, form]);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingServer(null);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingServer) {
        updateMutation.mutate({ id: editingServer.id, data: values });
      } else {
        createMutation.mutate(values);
      }

      // 提交后关闭模态框
      if (updateMutation.isSuccess || createMutation.isSuccess) {
        setIsModalVisible(false);
      }
    });
  };

  return (
    <FormModal
      title={editingServer ? "编辑服务器" : "添加服务器"}
      open={isModalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      form={form}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      autoValidate={true}
    >
      <Form.Item
        name="name"
        label="服务器名称"
        rules={[{ required: true, message: "请输入服务器名称" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="host"
        label="主机地址"
        rules={[{ required: true, message: "请输入主机地址" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="port" label="SSH端口" initialValue={22}>
        <InputNumber min={1} max={65535} />
      </Form.Item>
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        extra="如果使用密钥认证，可以留空"
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>

      <Form.Item
        name="connectionType"
        label="连接类型"
        initialValue="direct"
        rules={[{ required: true, message: "请选择连接类型" }]}
      >
        <Select>
          <Select.Option value="direct">直连</Select.Option>
          <Select.Option value="proxy">代理</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="proxyId"
        label="代理服务器"
        tooltip="如果选择代理连接，请选择代理服务器"
        rules={[
          {
            validator: (_, value) => {
              if (connectionType !== "proxy" || value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("请选择代理服务器"));
            },
          },
        ]}
        hidden={connectionType !== "proxy"}
      >
        <Select placeholder="请选择代理服务器">
          {proxies.map((proxy: ProxyEntity) => (
            <Select.Option key={proxy.id} value={proxy.id}>
              {proxy.name} ({proxy.id})
              {proxy.status === "online" ? " - 在线" : " - 离线"}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="privateKey"
        label="私钥"
        extra="如果使用密码认证，可以留空"
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </FormModal>
  );
};

export default React.memo(ServerFormModal);
