import React, { useState } from "react";
import { Form, Input, Tag, Space, Button } from "antd";
import { CloudServerOutlined, ApiOutlined } from "@ant-design/icons";
import { useEntityCRUD } from "../../hooks/useEntityCRUD";
import { EntityPage, EntityFormItem } from "../../components/entity";
import { proxiesApi } from "../../api/proxies";
import { ProxyEntity, CreateProxyDto, UpdateProxyDto } from "../../types/api"; // Update import path
import { DEFAULT_PAGE_SIZE } from "../../constants";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

/**
 * 代理管理页面
 */
const Proxies: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  // 使用通用实体CRUD Hook（启用分页）
  const {
    data: proxies,
    isLoading,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    tablePaginationConfig,
    handleTableChange,
  } = useEntityCRUD<ProxyEntity, CreateProxyDto, UpdateProxyDto>({
    api: {
      // 使用空的getAll实现（不会被调用，因为启用了分页）
      getAll: async () => [],
      // 添加分页API
      getPaginated: proxiesApi.getProxiesPaginated,
      // 确保ID传递给API是字符串
      getById: (id: string | number) => proxiesApi.getProxy(String(id)),
      create: proxiesApi.createProxy,
      update: (id: string | number, data: UpdateProxyDto) =>
        proxiesApi.updateProxy(String(id), data),
      delete: (id: string | number) => proxiesApi.deleteProxy(String(id)),
    },
    queryKey: "proxies",
    autoRefresh,
    refreshInterval: 10000,
    messages: {
      createSuccess: "代理创建成功",
      updateSuccess: "代理更新成功",
      deleteSuccess: "代理删除成功",
    },
    // 启用分页
    usePagination: true,
    // 默认分页参数
    defaultPaginationParams: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    },
  });

  // 表单项配置
  const formItems: EntityFormItem[] = [
    {
      name: "id",
      label: "代理ID",
      component: <Input placeholder="请输入代理ID，如 proxy-1" />,
      rules: [{ required: true, message: "请输入代理ID" }],
      hidden: (form, isEditMode) => isEditMode, // 编辑模式下隐藏ID字段
    },
    {
      name: "name",
      label: "代理名称",
      component: <Input placeholder="请输入代理名称" />,
      rules: [{ required: true, message: "请输入代理名称" }],
    },
    {
      name: "description",
      label: "描述",
      component: <Input.TextArea rows={3} placeholder="请输入代理描述" />,
    },
    {
      name: "apiKey",
      label: "API密钥",
      component: <Input.Password placeholder="请输入API密钥" />,
      tooltip: "用于代理服务认证的密钥，建议使用复杂的随机字符串",
    },
  ];

  // 处理创建代理
  const handleCreateProxy = async (values: CreateProxyDto) => {
    await createMutation.mutateAsync(values);
  };

  // 处理更新代理
  const handleUpdateProxy = async (
    id: string | number,
    values: UpdateProxyDto
  ) => {
    // Accept string or number
    await updateMutation.mutateAsync({ id, data: values });
  };

  // 表格列配置
  const columns = [
    {
      title: "代理ID",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "online" ? "success" : "default"}>
          {status === "online" ? "在线" : "离线"}
        </Tag>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "最后在线时间",
      dataIndex: "lastSeen",
      key: "lastSeen",
      width: 180,
      render: (lastSeen: string, record: ProxyEntity) =>
        record.status === "online" ? (
          <span>当前在线</span>
        ) : lastSeen ? (
          <span>
            {formatDistanceToNow(new Date(lastSeen), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
  ];

  return (
    <EntityPage
      title="代理管理"
      subtitle="管理中介代理服务"
      entities={proxies}
      isLoading={isLoading}
      enableAutoRefresh
      defaultAutoRefresh={autoRefresh}
      refreshInterval={10000}
      onRefresh={() => refetch()}
      onAutoRefreshChange={setAutoRefresh}
      tableProps={{
        columns,
        rowKey: "id",
        // 添加分页配置
        pagination: tablePaginationConfig,
        // 添加表格变化处理函数
        onChange: handleTableChange,
      }}
      formProps={{
        items: formItems,
      }}
      onCreateEntity={handleCreateProxy}
      onUpdateEntity={handleUpdateProxy}
    />
  );
};

export default Proxies;
