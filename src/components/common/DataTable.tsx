import React, { ReactNode } from "react";
import { Table, TableProps, Spin } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { TableSize } from "../../types/common";

export interface DataTableProps<T extends Record<string, unknown>>
  extends Omit<TableProps<T>, "loading"> {
  // 数据相关
  dataSource: T[];

  // 加载状态
  isLoading?: boolean;

  // 分页配置
  pagination?: TablePaginationConfig | false;

  // 空状态展示
  emptyText?: ReactNode;

  // 表格大小
  size?: TableSize;

  // 表格样式
  className?: string;
}

/**
 * 通用数据表格组件
 *
 * 封装了常用的表格功能，统一处理加载状态、空状态等
 */
function DataTable<T extends Record<string, unknown>>({
  dataSource,
  isLoading = false,
  pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  },
  emptyText = "暂无数据",
  size = "middle",
  className = "",
  ...restProps
}: DataTableProps<T>) {
  return (
    <Spin spinning={isLoading}>
      <Table<T>
        dataSource={dataSource}
        pagination={pagination}
        size={size}
        className={className}
        locale={{ emptyText }}
        {...restProps}
      />
    </Spin>
  );
}

export default React.memo(DataTable) as typeof DataTable;
