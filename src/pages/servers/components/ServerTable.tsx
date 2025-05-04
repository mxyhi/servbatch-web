import React from "react";
import { TableProps } from "antd";
import { ServerEntity } from "../../../api/servers";
import { UseMutationResult } from "@tanstack/react-query";
import { DataTable } from "../../../components/common";
import { getServerTableColumns } from "./ServerTableColumns";
import { ID } from "../../../types/common";

interface ServerTableProps {
  // 数据和加载状态
  servers: ServerEntity[] | undefined;
  isLoading: boolean;

  // 操作回调
  onEdit: (server: ServerEntity) => void;
  onDelete: (id: ID) => void;
  onTestConnection: (id: ID) => void;

  // 测试连接mutation
  testConnectionMutation: UseMutationResult<void, Error, ID, unknown>;

  // 表格属性
  tableProps?: Omit<
    TableProps<ServerEntity>,
    "dataSource" | "columns" | "rowKey" | "loading"
  >;
}

/**
 * 服务器表格组件
 *
 * 展示服务器列表，提供编辑、删除、测试连接等操作
 */
const ServerTable: React.FC<ServerTableProps> = ({
  servers,
  isLoading,
  onEdit,
  onDelete,
  onTestConnection,
  testConnectionMutation,
  tableProps,
}) => {
  // 将 ServerEntity 转换为 Record<string, unknown> 类型
  const serverDataSource = (servers || []).map((server) => ({
    ...server,
  })) as unknown as Record<string, unknown>[];

  // 转换列定义以匹配 Record<string, unknown> 类型
  const columns = getServerTableColumns({
    showModal: (server?: ServerEntity) => server && onEdit(server),
    handleDelete: onDelete,
    handleTestConnection: onTestConnection,
    testConnectionMutation,
  }).map((column) => {
    if (column.render) {
      const originalRender = column.render;
      return {
        ...column,
        render: (value: any, record: any) =>
          originalRender(value, record as ServerEntity),
      };
    }
    return column;
  });

  // 转换表格属性以匹配 Record<string, unknown> 类型
  const convertedTableProps = tableProps as any;

  return (
    <DataTable<Record<string, unknown>>
      dataSource={serverDataSource}
      columns={columns as any}
      rowKey="id"
      isLoading={isLoading}
      scroll={{ x: 1200 }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      {...convertedTableProps}
    />
  );
};

export default React.memo(ServerTable);
