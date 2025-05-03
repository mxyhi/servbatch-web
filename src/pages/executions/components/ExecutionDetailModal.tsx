import React from "react";
import { Modal, Button, Descriptions, Typography } from "antd";
import { TaskExecutionEntity } from "../../../api/executions";

const { Text } = Typography;

interface ExecutionDetailModalProps {
  visible: boolean;
  execution: TaskExecutionEntity | null;
  onClose: () => void;
}

/**
 * 执行记录详情模态框组件
 */
const ExecutionDetailModal: React.FC<ExecutionDetailModalProps> = ({
  visible,
  execution,
  onClose,
}) => {
  if (!execution) {
    return null;
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "queued":
        return "排队中";
      case "running":
        return "运行中";
      case "completed":
        return "已完成";
      case "failed":
        return "失败";
      case "cancelled":
        return "已取消";
      default:
        return status;
    }
  };

  return (
    <Modal
      title="执行详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID">{execution.id}</Descriptions.Item>
        <Descriptions.Item label="任务ID">{execution.taskId}</Descriptions.Item>
        <Descriptions.Item label="服务器ID">{execution.serverId}</Descriptions.Item>
        <Descriptions.Item label="状态">{getStatusText(execution.status)}</Descriptions.Item>
        <Descriptions.Item label="退出码">{execution.exitCode ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {new Date(execution.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="开始时间">
          {execution.startedAt ? new Date(execution.startedAt).toLocaleString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="完成时间">
          {execution.completedAt ? new Date(execution.completedAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-4">
        <Text strong>输出:</Text>
        <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
          {execution.output || "无输出"}
        </pre>
      </div>
    </Modal>
  );
};

export default ExecutionDetailModal;
