import { useState, useCallback, useEffect, useRef } from "react";
import { DEFAULT_REFRESH_INTERVAL } from "../constants";

/**
 * 自动刷新Hook配置选项
 */
export interface UseAutoRefreshOptions {
  /** 默认刷新间隔（毫秒） */
  defaultInterval?: number;

  /** 默认自动刷新状态 */
  defaultEnabled?: boolean;

  /** 自动刷新回调函数 */
  onRefresh?: () => void | Promise<void>;

  /** 是否在组件挂载时立即刷新 */
  refreshOnMount?: boolean;

  /** 是否在自动刷新状态变化时触发回调 */
  triggerOnChange?: boolean;
}

/**
 * 自动刷新Hook返回值
 */
export interface UseAutoRefreshResult {
  /** 自动刷新状态 */
  autoRefresh: boolean;

  /** 切换自动刷新状态 */
  toggleAutoRefresh: () => void;

  /** 设置自动刷新状态 */
  setAutoRefresh: (value: boolean) => void;

  /** 获取刷新间隔（用于react-query等库） */
  getRefreshInterval: (customInterval?: number) => number | false;

  /** 当前刷新间隔 */
  refreshInterval: number;

  /** 设置刷新间隔 */
  setRefreshInterval: (interval: number) => void;

  /** 手动触发刷新 */
  refresh: () => void;

  /** 刷新计数器（每次刷新自增） */
  refreshCount: number;

  /** 是否正在刷新 */
  isRefreshing: boolean;
}

/**
 * 自动刷新Hook
 *
 * 提供自动刷新功能，可用于数据的定时刷新
 *
 * @example
 * ```tsx
 * const { autoRefresh, setAutoRefresh, refresh } = useAutoRefresh({
 *   defaultInterval: 5000,
 *   onRefresh: () => refetchData(),
 *   refreshOnMount: true
 * });
 *
 * // 在UI中使用
 * <AutoRefreshToggle autoRefresh={autoRefresh} onChange={setAutoRefresh} />
 * <Button onClick={refresh}>刷新</Button>
 * ```
 */
const useAutoRefresh = ({
  defaultInterval = DEFAULT_REFRESH_INTERVAL,
  defaultEnabled = false,
  onRefresh,
  refreshOnMount = false,
  triggerOnChange = false,
}: UseAutoRefreshOptions = {}): UseAutoRefreshResult => {
  // 使用useRef避免不必要的重渲染
  const refreshingRef = useRef(false);

  // 状态
  const [autoRefresh, setAutoRefreshState] = useState(defaultEnabled);
  const [refreshInterval, setRefreshInterval] = useState(defaultInterval);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 手动刷新函数
  const refresh = useCallback(async () => {
    // 防止重复刷新
    if (refreshingRef.current) return;

    try {
      refreshingRef.current = true;
      setIsRefreshing(true);

      if (onRefresh) {
        await onRefresh();
      }

      setRefreshCount((prev) => prev + 1);
    } finally {
      refreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  // 设置自动刷新状态
  const setAutoRefresh = useCallback(
    (value: boolean) => {
      setAutoRefreshState(value);

      // 如果开启了triggerOnChange，则在状态变化时触发刷新
      if (triggerOnChange && value && onRefresh) {
        refresh();
      }
    },
    [triggerOnChange, onRefresh, refresh]
  );

  // 切换自动刷新状态
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(!autoRefresh);
  }, [autoRefresh, setAutoRefresh]);

  // 自动刷新定时器
  useEffect(() => {
    let timerId: number | null = null;
    let isMounted = true;

    // 使用setTimeout递归实现轮询，防止任务堆积
    const scheduleNextRefresh = async () => {
      if (!isMounted || !autoRefresh) return;

      try {
        await refresh();
      } catch (error) {
        console.error("自动刷新出错:", error);
      }

      // 只有当组件仍然挂载且自动刷新仍然开启时，才设置下一次刷新
      if (isMounted && autoRefresh) {
        timerId = window.setTimeout(scheduleNextRefresh, refreshInterval);
      }
    };

    if (autoRefresh) {
      // 立即开始第一次轮询
      timerId = window.setTimeout(scheduleNextRefresh, refreshInterval);
    }

    return () => {
      isMounted = false;
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    };
  }, [autoRefresh, refreshInterval, refresh]);

  // 组件挂载时刷新
  useEffect(() => {
    if (refreshOnMount) {
      refresh();
    }
  }, [refreshOnMount, refresh]);

  // 获取刷新间隔（用于react-query等库）
  const getRefreshInterval = useCallback(
    (customInterval?: number): number | false => {
      const interval = customInterval || refreshInterval;
      return autoRefresh ? interval : false;
    },
    [autoRefresh, refreshInterval]
  );

  return {
    autoRefresh,
    toggleAutoRefresh,
    setAutoRefresh,
    getRefreshInterval,
    refreshInterval,
    setRefreshInterval,
    refresh,
    refreshCount,
    isRefreshing,
  };
};

export default useAutoRefresh;
