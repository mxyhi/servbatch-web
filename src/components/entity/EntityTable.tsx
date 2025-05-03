import React, { ReactNode, useMemo } from "react";
import { Table, TableProps, Spin, Empty, Typography } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { SyncOutlined } from "@ant-design/icons";

/**
 * 实体表格属性
 */
export interface EntityTableProps<T extends Record<string, any>> extends Omit<TableProps<T>, "loading" | "dataSource"> {
  /** 表格数据 */
  entities?: T[];
  
  /** 是否加载中 */
  isLoading?: boolean;
  
  /** 是否正在刷新 */
  isRefreshing?: boolean;
  
  /** 分页配置 */
  pagination?: TablePaginationConfig | false;
  
  /** 空状态展示 */
  emptyContent?: ReactNode;
  
  /** 错误状态展示 */
  errorContent?: ReactNode;
  
  /** 表格标题 */
  title?: ReactNode;
  
  /** 表格底部 */
  footer?: ReactNode;
  
  /** 表格工具栏 */
  toolbar?: ReactNode;
  
  /** 表格大小 */
  size?: "small" | "middle" | "large";
  
  /** 表格样式 */
  className?: string;
  
  /** 是否显示边框 */
  bordered?: boolean;
  
  /** 是否显示表头 */
  showHeader?: boolean;
  
  /** 是否显示序号列 */
  showIndex?: boolean;
  
  /** 序号列标题 */
  indexColumnTitle?: string;
  
  /** 序号列宽度 */
  indexColumnWidth?: number;
  
  /** 是否可选择 */
  selectable?: boolean;
  
  /** 选择类型 */
  selectionType?: "checkbox" | "radio";
  
  /** 选择的行 */
  selectedRowKeys?: React.Key[];
  
  /** 选择改变回调 */
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  
  /** 行点击回调 */
  onRowClick?: (record: T, index: number) => void;
  
  /** 刷新回调 */
  onRefresh?: () => void;
}

/**
 * 通用实体表格组件
 * 
 * 基于Ant Design Table组件，增强了实体数据展示功能
 * 
 * @example
 * ```tsx
 * <EntityTable
 *   entities={users}
 *   isLoading={isLoading}
 *   columns={columns}
 *   title="用户列表"
 *   toolbar={
 *     <Button type="primary" onClick={handleAdd}>添加用户</Button>
 *   }
 *   showIndex
 *   selectable
 *   onSelectionChange={handleSelectionChange}
 * />
 * ```
 */
function EntityTable<T extends Record<string, any> = any>({
  entities = [],
  isLoading = false,
  isRefreshing = false,
  pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  },
  emptyContent,
  errorContent,
  title,
  footer,
  toolbar,
  size = "middle",
  className = "",
  bordered = false,
  showHeader = true,
  showIndex = false,
  indexColumnTitle = "序号",
  indexColumnWidth = 80,
  selectable = false,
  selectionType = "checkbox",
  selectedRowKeys,
  onSelectionChange,
  onRowClick,
  onRefresh,
  columns = [],
  ...restProps
}: EntityTableProps<T>) {
  // 构建表格列
  const tableColumns = useMemo(() => {
    const result = [...columns];
    
    // 添加序号列
    if (showIndex) {
      result.unshift({
        title: indexColumnTitle,
        dataIndex: "index",
        key: "index",
        width: indexColumnWidth,
        render: (_: any, __: any, index: number) => index + 1,
      });
    }
    
    return result;
  }, [columns, showIndex, indexColumnTitle, indexColumnWidth]);
  
  // 构建选择配置
  const rowSelection = useMemo(() => {
    if (!selectable) return undefined;
    
    return {
      type: selectionType,
      selectedRowKeys,
      onChange: onSelectionChange,
    };
  }, [selectable, selectionType, selectedRowKeys, onSelectionChange]);
  
  // 构建行属性
  const onRow = useMemo(() => {
    if (!onRowClick) return undefined;
    
    return (record: T, index: number) => ({
      onClick: () => onRowClick(record, index),
    });
  }, [onRowClick]);
  
  // 构建表格标题
  const tableTitle = useMemo(() => {
    if (!title && !toolbar && !onRefresh) return undefined;
    
    return () => (
      <div className="flex justify-between items-center">
        {title && (
          <Typography.Title level={5} className="m-0">
            {title}
          </Typography.Title>
        )}
        <div className="flex items-center space-x-2">
          {toolbar}
          {onRefresh && (
            <SyncOutlined
              spin={isRefreshing}
              onClick={onRefresh}
              className="cursor-pointer text-lg ml-2"
            />
          )}
        </div>
      </div>
    );
  }, [title, toolbar, onRefresh, isRefreshing]);
  
  // 构建空状态内容
  const emptyState = useMemo(() => {
    if (errorContent) {
      return errorContent;
    }
    
    if (emptyContent) {
      return emptyContent;
    }
    
    return <Empty description="暂无数据" />;
  }, [emptyContent, errorContent]);
  
  return (
    <Spin spinning={isLoading}>
      <Table<T>
        dataSource={entities}
        columns={tableColumns}
        pagination={pagination}
        size={size}
        className={className}
        bordered={bordered}
        showHeader={showHeader}
        rowSelection={rowSelection}
        onRow={onRow}
        title={tableTitle}
        footer={footer ? () => footer : undefined}
        locale={{ emptyText: emptyState }}
        rowKey={(record) => record.id?.toString() || Math.random().toString()}
        {...restProps}
      />
    </Spin>
  );
}

export default React.memo(EntityTable) as typeof EntityTable;
