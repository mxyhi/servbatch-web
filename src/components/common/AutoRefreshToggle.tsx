import React, { useCallback, useMemo } from "react";
import { Switch, Tooltip, Badge } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { DEFAULT_REFRESH_INTERVAL } from "../../constants";

interface AutoRefreshToggleProps {
  // 自动刷新状态
  autoRefresh: boolean;

  // 回调函数
  onChange: (checked: boolean) => void;

  // 可选配置
  refreshInterval?: number;
  tooltipPlacement?: "top" | "right" | "bottom" | "left";
  showLabel?: boolean;
  size?: "small" | "default";
}

/**
 * 自动刷新开关组件
 *
 * 用于控制数据的自动刷新功能
 */
const AutoRefreshToggle: React.FC<AutoRefreshToggleProps> = ({
  autoRefresh,
  onChange,
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  tooltipPlacement = "top",
  showLabel = true,
  size = "default",
}) => {
  // 处理开关变化
  const handleChange = useCallback(
    (checked: boolean) => {
      onChange(checked);
    },
    [onChange]
  );

  // 计算提示文本
  const tooltipTitle = useMemo(() => {
    const seconds = refreshInterval / 1000;
    return autoRefresh ? "关闭自动刷新" : `开启自动刷新 (每${seconds}秒)`;
  }, [autoRefresh, refreshInterval]);

  // 计算标签文本
  const labelText = useMemo(() => {
    return autoRefresh ? "自动刷新已开启" : "自动刷新已关闭";
  }, [autoRefresh]);

  return (
    <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
      <div className="flex items-center">
        <Badge
          status={autoRefresh ? "processing" : "default"}
          className="mr-1"
        />
        <Switch
          checkedChildren={<SyncOutlined spin />}
          unCheckedChildren={<SyncOutlined />}
          checked={autoRefresh}
          onChange={handleChange}
          size={size}
        />
        {showLabel && <span className="ml-2 text-sm">{labelText}</span>}
      </div>
    </Tooltip>
  );
};

export default React.memo(AutoRefreshToggle);
