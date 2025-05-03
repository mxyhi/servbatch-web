import React from "react";
import { Tag } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import {
  ServerStatus,
  ExecutionStatus,
  STATUS_TAG_CONFIG,
  EXECUTION_STATUS_TAG_CONFIG,
} from "../../constants";

interface ServerStatusTagProps {
  status: ServerStatus;
}

export const ServerStatusTag: React.FC<ServerStatusTagProps> = ({ status }) => {
  const config = STATUS_TAG_CONFIG[status];

  let icon = null;
  if (status === ServerStatus.ONLINE) {
    icon = <CheckCircleFilled />;
  } else if (status === ServerStatus.OFFLINE) {
    icon = <CloseCircleFilled />;
  } else if (status === ServerStatus.UNKNOWN) {
    icon = <QuestionCircleFilled />;
  }

  return (
    <Tag color={config.color} icon={icon}>
      {config.text}
    </Tag>
  );
};

interface ExecutionStatusTagProps {
  status: ExecutionStatus;
}

export const ExecutionStatusTag: React.FC<ExecutionStatusTagProps> = ({
  status,
}) => {
  const config = EXECUTION_STATUS_TAG_CONFIG[status];
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 使用React.memo优化渲染
const MemoizedServerStatusTag = React.memo(ServerStatusTag);
const MemoizedExecutionStatusTag = React.memo(ExecutionStatusTag);

export {
  MemoizedServerStatusTag as ServerStatusTag,
  MemoizedExecutionStatusTag as ExecutionStatusTag,
};

export default {
  ServerStatusTag: MemoizedServerStatusTag,
  ExecutionStatusTag: MemoizedExecutionStatusTag,
};
