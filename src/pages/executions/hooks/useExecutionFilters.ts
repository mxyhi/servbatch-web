import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "../../../api/tasks";
import { serversApi } from "../../../api/servers";

/**
 * 处理执行记录筛选的自定义Hook
 */
export const useExecutionFilters = () => {
  const [filterTaskId, setFilterTaskId] = useState<number | null>(null);
  const [filterServerId, setFilterServerId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();

  // 从URL查询参数中读取taskId
  useEffect(() => {
    const taskIdParam = searchParams.get("taskId");
    if (taskIdParam) {
      const taskId = parseInt(taskIdParam, 10);
      if (!isNaN(taskId)) {
        setFilterTaskId(taskId);
        setFilterServerId(null);
      }
    }
  }, [searchParams]);

  // 获取任务列表
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAllTasks,
  });

  // 获取服务器列表
  const { data: servers } = useQuery({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
  });

  // 处理任务筛选变化
  const handleTaskFilterChange = (value: number | null) => {
    setFilterTaskId(value);
    if (value !== null) {
      setFilterServerId(null);
    }
  };

  // 处理服务器筛选变化
  const handleServerFilterChange = (value: number | null) => {
    setFilterServerId(value);
    if (value !== null) {
      setFilterTaskId(null);
    }
  };

  // 重置筛选
  const resetFilters = () => {
    setFilterTaskId(null);
    setFilterServerId(null);
  };

  return {
    filterTaskId,
    filterServerId,
    tasks,
    servers,
    handleTaskFilterChange,
    handleServerFilterChange,
    resetFilters,
  };
};
