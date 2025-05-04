import React, { useState } from "react";
import { Tag, Input, Select } from "antd";
import { FormInstance } from "antd/es/form";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useEntityCRUD } from "../../hooks/useEntityCRUD";
import { EntityPage, EntityFormItem } from "../../components/entity";
import { usersApi } from "../../api/users";
import { UserEntity, CreateUserDto, UpdateUserDto } from "../../types/api"; // Update import path
import { ID } from "../../types/common"; // Import ID type
import { DEFAULT_PAGE_SIZE } from "../../constants";

/**
 * 用户管理页面
 */
const Users: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  // 使用通用实体CRUD Hook（启用分页）
  const {
    data: users,
    isLoading,
    refetch,
    createMutation,
    updateMutation,
    tablePaginationConfig,
    handleTableChange,
  } = useEntityCRUD<UserEntity, CreateUserDto, UpdateUserDto>({
    api: {
      // 使用空的getAll实现（不会被调用，因为启用了分页）
      getAll: async () => [],
      // 添加分页API
      getPaginated: usersApi.getUsersPaginated,
      getById: usersApi.getUser,
      create: usersApi.createUser,
      update: usersApi.updateUser,
      delete: usersApi.deleteUser,
    },
    queryKey: "users",
    autoRefresh,
    refreshInterval: 30000,
    messages: {
      createSuccess: "用户创建成功",
      updateSuccess: "用户更新成功",
      deleteSuccess: "用户删除成功",
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
      name: "username",
      label: "用户名",
      component: <Input prefix={<UserOutlined />} placeholder="请输入用户名" />,
      rules: [{ required: true, message: "请输入用户名" }],
    },
    {
      name: "password",
      label: "密码",
      component: (
        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
      ),
      rules: [
        // Use a function rule to make 'required' conditional on create mode (!isEditMode)
        // The misplaced 'hidden' property inside the rule is removed.
        // Add type for getFieldValue from FormInstance methods
        ({
          getFieldValue,
        }: {
          getFieldValue: FormInstance["getFieldValue"];
        }) => ({
          required: !getFieldValue("id"), // Require password only if ID is not present (create mode)
          message: "请输入密码",
        }),
      ],
      // Add explicit types to the hidden function parameters, although the type definition should cover this
      hidden: () => false,
    },
    {
      name: "email",
      label: "电子邮件",
      component: (
        <Input prefix={<MailOutlined />} placeholder="请输入电子邮件" />
      ),
    },
    {
      name: "role",
      label: "角色",
      component: (
        <Select placeholder="请选择角色">
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">普通用户</Select.Option>
        </Select>
      ),
      // 使用初始值
      rules: [{ required: true, message: "请选择角色" }],
    },
  ];

  // 处理创建用户
  const handleCreateUser = async (values: CreateUserDto) => {
    await createMutation.mutateAsync(values);
  };

  // 处理更新用户
  const handleUpdateUser = async (id: ID, values: UpdateUserDto) => {
    // Accept ID type
    // 如果密码为空，则不更新密码
    if (values.password === "") {
      delete values.password;
    }
    await updateMutation.mutateAsync({ id, data: values });
  };

  // 表格列配置
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "电子邮件",
      dataIndex: "email",
      key: "email",
      render: (email: string) => email || "-",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "已激活" : "未激活"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
  ];

  return (
    <EntityPage
      title="用户管理"
      subtitle="管理系统用户"
      entities={users}
      isLoading={isLoading}
      enableAutoRefresh
      defaultAutoRefresh={autoRefresh}
      refreshInterval={30000}
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
      onCreateEntity={handleCreateUser}
      onUpdateEntity={handleUpdateUser}
    />
  );
};

export default Users;
