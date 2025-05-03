import React from "react";
import { Table, Tag, Typography, Drawer } from "antd";
import { CommandMonitorEntity, CommandMonitorExecutionEntity } from "../../api/commandMonitors";

const { Title, Text } = Typography;

interface CommandMonitorHistoryProps {
  visible: boolean;
  onClose: () => void;
  monitor?: CommandMonitorEntity;
  executions?: CommandMonitorExecutionEntity[];
  isLoading: boolean;
}

/**
 * 命令监控历史组件
 */
const CommandMonitorHistory: React.FC<CommandMonitorHistoryProps> = ({
  visible,
  onClose,
  monitor,
  executions = [],
  isLoading,
}) => {
  // 执行历史表格列定义
  const executionColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "执行时间",
      dataIndex: "executedAt",
      key: "executedAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "检查退出码",
      dataIndex: "checkExitCode",
      key: "checkExitCode",
      render: (code: number) => (
        <Tag color={code === 0 ? "success" : "error"}>{code}</Tag>
      ),
    },
    {
      title: "是否执行",
      dataIndex: "executed",
      key: "executed",
      render: (executed: boolean) =>
        executed ? (
          <Tag color="warning">已执行</Tag>
        ) : (
          <Tag color="default">未执行</Tag>
        ),
    },
    {
      title: "执行退出码",
      dataIndex: "executeExitCode",
      key: "executeExitCode",
      render: (code: number | undefined) =>
        code === undefined ? (
          <span>-</span>
        ) : (
          <Tag color={code === 0 ? "success" : "error"}>{code}</Tag>
        ),
    },
  ];

  return (
    <Drawer
      title="执行历史"
      placement="right"
      onClose={onClose}
      open={visible}
      width={800}
    >
      {monitor && (
        <div>
          <div className="mb-4">
            <Title level={5}>{monitor.name}</Title>
            <div className="flex flex-col gap-2 mt-4">
              <Text strong>检查命令:</Text>
              <div className="bg-gray-100 p-2 rounded">
                <Text code>{monitor.checkCommand}</Text>
              </div>
              <Text strong>执行命令:</Text>
              <div className="bg-gray-100 p-2 rounded">
                <Text code>{monitor.executeCommand}</Text>
              </div>
            </div>
          </div>
          <Table
            dataSource={executions}
            columns={executionColumns}
            rowKey="id"
            loading={isLoading}
            expandable={{
              expandedRowRender: (record: CommandMonitorExecutionEntity) => (
                <div className="p-4">
                  <div className="mb-4">
                    <Text strong>检查命令输出:</Text>
                    <div className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">
                      {record.checkOutput || "无输出"}
                    </div>
                  </div>
                  {record.executed && (
                    <div>
                      <Text strong>执行命令输出:</Text>
                      <div className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">
                        {record.executeOutput || "无输出"}
                      </div>
                    </div>
                  )}
                </div>
              ),
            }}
          />
        </div>
      )}
    </Drawer>
  );
};

export default React.memo(CommandMonitorHistory);
