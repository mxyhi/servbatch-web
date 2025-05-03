import React, { useState } from "react";
import { Tag, Input, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useEntityCRUD } from "../../hooks/useEntityCRUD";
import { EntityPage, EntityFormItem } from "../../components/entity";
import {
  usersApi,
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
} from "../../api/users";

/**
 * 用户管理页面
 */
const Users: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  // 使用通用实体CRUD Hook
  const {
    data: users,
    isLoading,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useEntityCRUD<UserEntity, CreateUserDto, UpdateUserDto>({
    api: {
      getAll: usersApi.getAllUsers,
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
  });

  // 表单项配置
  const formItems: EntityFormItem[] = [
    {
      name: "username",
      label: "用户名",
      component: (
        <Input
          prefix={<UserOutlined />}
          placeholder="请输入用户名"
        />
      ),
      rules: [{ required: true, message: "请输入用户名" }],
    },
    {
      name: "password",
      label: "密码",
      component: (
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入密码"
        />
      ),
      rules: [
        { required: true, message: "请输入密码", hidden: (form, isEditMode) => isEditMode },
      ],
      hidden: (form, isEditMode) => false, // 编辑模式下也显示密码字段，但不是必填
    },
    {
      name: "email",
      label: "电子邮件",
      component: (
        <Input
          prefix={<MailOutlined />}
          placeholder="请输入电子邮件"
        />
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
      defaultValue: "user",
    },
  ];

  // 处理创建用户
  const handleCreateUser = async (values: CreateUserDto) => {
    await createMutation.mutateAsync(values);
  };

  // 处理更新用户
  const handleUpdateUser = async (id: number, values: UpdateUserDto) => {
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
