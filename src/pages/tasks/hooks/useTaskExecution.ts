import { useState } from "react";
import { Form } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "../../../utils/message";
import { executionsApi } from "../../../api/executions";
import { serversApi } from "../../../api/servers";
import { useNavigate } from "react-router-dom";
import { ID } from "../../../types/common";

/**
 * 处理任务执行的自定义Hook
 */
export const useTaskExecution = () => {
  const [executeForm] = Form.useForm();
  const [isExecuteModalVisible, setIsExecuteModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<ID | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 执行任务
  const executeMutation = useMutation({
    mutationFn: executionsApi.createExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success("任务已提交执行");
      setIsExecuteModalVisible(false);
      executeForm.resetFields();
      setSelectedTaskId(null);
    },
    onError: (error) => {
      message.error(
        `执行失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 获取服务器选项
  const fetchServerOptions = async (search: string, page: number) => {
    try {
      const result = await serversApi.getServersPaginatedSearch({
        page,
        pageSize: 10,
        search,
      });

      // 将服务器数据转换为Select选项格式
      const options = result.items.map((server) => ({
        label: `${server.name} (${server.host})`,
        value: server.id,
      }));

      return {
        data: options,
        total: result.total,
      };
    } catch (error) {
      console.error("Error fetching server options:", error);
      return {
        data: [],
        total: 0,
      };
    }
  };

  // 获取所有服务器选项（用于全选功能）
  const fetchAllServerOptions = async () => {
    try {
      // 获取所有服务器（可能需要多次请求）
      const allOptions = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await serversApi.getServersPaginatedSearch({
          page: currentPage,
          pageSize: 100, // 使用较大的pageSize减少请求次数
        });

        const options = result.items.map((server) => ({
          label: `${server.name} (${server.host})`,
          value: server.id,
        }));

        allOptions.push(...options);

        if (options.length < 100 || allOptions.length >= result.total) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }

      return allOptions;
    } catch (error) {
      console.error("Error fetching all server options:", error);
      return [];
    }
  };

  // 显示执行模态框
  const showExecuteModal = (taskId: ID) => {
    setSelectedTaskId(taskId);
    executeForm.resetFields();
    setIsExecuteModalVisible(true);
  };

  // 关闭执行模态框
  const handleExecuteCancel = () => {
    setIsExecuteModalVisible(false);
    setSelectedTaskId(null);
    executeForm.resetFields();
  };

  // 处理执行任务
  const handleExecute = (values: { serverIds: ID[] }) => {
    if (selectedTaskId) {
      executeMutation.mutate({
        taskId: selectedTaskId,
        serverIds: values.serverIds,
        priority: 0, // 默认优先级
      });
    }
  };

  // 处理查看历史
  const handleViewHistory = (taskId: ID) => {
    navigate(`/executions?taskId=${taskId}`);
  };

  return {
    executeForm,
    isExecuteModalVisible,
    selectedTaskId,
    showExecuteModal,
    handleExecuteCancel,
    handleExecute,
    handleViewHistory,
    executeMutation,
    fetchServerOptions,
    fetchAllServerOptions,
  };
};
