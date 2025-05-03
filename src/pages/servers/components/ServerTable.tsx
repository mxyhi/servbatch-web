import React, { useMemo } from "react";
import { TableProps } from "antd";
import { ServerEntity } from "../../../api/servers";
import { UseMutationResult } from "@tanstack/react-query";
import { DataTable } from "../../../components/common";
import { getServerTableColumns } from "./ServerTableColumns";

interface ServerTableProps {
  // 数据和加载状态
  servers: ServerEntity[] | undefined;
  isLoading: boolean;

  // 操作回调
  onEdit: (server: ServerEntity) => void;
  onDelete: (id: number) => void;
  onTestConnection: (id: number) => void;

  // 测试连接mutation
  testConnectionMutation: UseMutationResult<void, Error, number, unknown>;

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
  // 获取表格列配置
  const columns = useMemo(() => {
    return getServerTableColumns({
      showModal: onEdit,
      handleDelete: onDelete,
      handleTestConnection: onTestConnection,
      testConnectionMutation,
    });
  }, [onEdit, onDelete, onTestConnection, testConnectionMutation]);

  return (
    <DataTable
      dataSource={servers || []}
      columns={columns}
      rowKey="id"
      isLoading={isLoading}
      scroll={{ x: 1200 }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      {...tableProps}
    />
  );
};

export default React.memo(ServerTable);
