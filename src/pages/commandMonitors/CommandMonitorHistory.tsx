import React, { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Drawer,
  Button,
  Modal,
  Form,
  DatePicker,
  Space,
} from "antd";
import { commandMonitorsApi } from "../../api/commandMonitors";
import {
  CommandMonitorEntity,
  CommandMonitorExecutionEntity,
  CleanupByDateDto,
} from "../../types/api";
import { ID } from "../../types/common";

// 扩展命令监控执行实体接口，添加组件中使用的属性
interface ExtendedCommandMonitorExecutionEntity
  extends CommandMonitorExecutionEntity {
  executedAt?: string;
  checkExitCode?: number;
  executed?: boolean;
  executeExitCode?: number;
  checkOutput?: string;
  executeOutput?: string;
}
import { DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { message } from "../../utils/message";

const { Title, Text } = Typography;

interface CommandMonitorHistoryProps {
  visible: boolean;
  onClose: () => void;
  monitor?: CommandMonitorEntity;
  executions?: ExtendedCommandMonitorExecutionEntity[];
  isLoading: boolean;
  onExecutionsChange?: () => void;
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
  onExecutionsChange,
}) => {
  const [cleanupDateModalVisible, setCleanupDateModalVisible] = useState(false);
  const [dateForm] = Form.useForm();

  // 清理所有执行历史
  const cleanupAllMutation = useMutation({
    mutationFn: (id: ID) => commandMonitorsApi.cleanupExecutionsByMonitorId(id),
    onSuccess: (result) => {
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
      if (onExecutionsChange) {
        onExecutionsChange();
      }
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 按日期范围清理
  const cleanupByDateMutation = useMutation({
    mutationFn: ({ id, data }: { id: ID; data: CleanupByDateDto }) =>
      commandMonitorsApi.cleanupExecutionsByDate(id, data),
    onSuccess: (result) => {
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
      setCleanupDateModalVisible(false);
      dateForm.resetFields();
      if (onExecutionsChange) {
        onExecutionsChange();
      }
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 处理清理所有执行历史
  const handleCleanupAll = () => {
    if (!monitor) return;

    Modal.confirm({
      title: "确认清理",
      content: `确定要清理 "${monitor.name}" 的所有执行历史记录吗？此操作不可恢复。`,
      onOk: () => {
        cleanupAllMutation.mutate(monitor.id);
      },
      okText: "确定",
      cancelText: "取消",
    });
  };

  // 显示按日期清理模态框
  const showCleanupDateModal = () => {
    setCleanupDateModalVisible(true);
  };

  // 处理按日期清理
  const handleCleanupByDate = (values: any) => {
    if (!monitor) return;

    const { dateRange } = values;
    if (dateRange && dateRange.length === 2) {
      const cleanupData: CleanupByDateDto = {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      };
      cleanupByDateMutation.mutate({ id: monitor.id, data: cleanupData });
    }
  };
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
            <div className="flex justify-between items-center">
              <Title level={5}>{monitor.name}</Title>
              <Space>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={showCleanupDateModal}
                >
                  按日期清理
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleCleanupAll}
                >
                  清理全部
                </Button>
              </Space>
            </div>
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
              expandedRowRender: (
                record: ExtendedCommandMonitorExecutionEntity
              ) => (
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

      {/* 按日期范围清理模态框 */}
      <Modal
        title="按日期范围清理执行记录"
        open={cleanupDateModalVisible}
        onCancel={() => setCleanupDateModalVisible(false)}
        footer={null}
      >
        <Form form={dateForm} onFinish={handleCleanupByDate} layout="vertical">
          <Form.Item
            name="dateRange"
            label="日期范围"
            rules={[{ required: true, message: "请选择日期范围" }]}
          >
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                type="default"
                onClick={() => setCleanupDateModalVisible(false)}
                className="mr-2"
              >
                取消
              </Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={cleanupByDateMutation.isPending}
              >
                清理
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default React.memo(CommandMonitorHistory);
