import React from "react";
import { ServerEntity } from "../../../api/servers";
import { UseMutationResult } from "@tanstack/react-query";
import { ServerStatus } from "../../../constants";
import {
  ServerStatusTag,
  DateDisplay,
  EditButton,
  TestConnectionButton,
  DeleteButton,
  ActionGroup,
} from "../../../components/common";

interface ServerTableColumnsProps {
  showModal: (server?: ServerEntity) => void;
  handleDelete: (id: number) => void;
  handleTestConnection: (id: number) => void;
  testConnectionMutation: UseMutationResult<void, Error, number, unknown>;
}

export const getServerTableColumns = ({
  showModal,
  handleDelete,
  handleTestConnection,
  testConnectionMutation,
}: ServerTableColumnsProps) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "主机",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "端口",
      dataIndex: "port",
      key: "port",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "连接类型",
      dataIndex: "connectionType",
      key: "connectionType",
      render: (type: string) => {
        return type === "direct" ? "直连" : "代理";
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: ServerStatus) => <ServerStatusTag status={status} />,
    },
    {
      title: "最后检查时间",
      dataIndex: "lastChecked",
      key: "lastChecked",
      render: (date: Date | undefined) => (
        <DateDisplay date={date} defaultText="未检查" />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => <DateDisplay date={date} />,
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: ServerEntity) => (
        <ActionGroup>
          <EditButton onClick={() => showModal(record)} />
          <TestConnectionButton
            onClick={() => handleTestConnection(record.id)}
            loading={
              testConnectionMutation.isPending &&
              testConnectionMutation.variables === record.id
            }
          />
          <DeleteButton
            onConfirm={() => handleDelete(record.id)}
            title="确定要删除这个服务器吗?"
          />
        </ActionGroup>
      ),
    },
  ];

  return columns;
};
