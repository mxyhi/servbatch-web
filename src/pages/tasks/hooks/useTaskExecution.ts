import { useState } from "react";
import { Form } from "antd";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { message } from "../../../utils/message";
import { executionsApi } from "../../../api/executions";
import { serversApi } from "../../../api/servers";
import { useNavigate } from "react-router-dom";

/**
 * 处理任务执行的自定义Hook
 */
export const useTaskExecution = () => {
  const [executeForm] = Form.useForm();
  const [isExecuteModalVisible, setIsExecuteModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 获取服务器列表
  const { data: servers } = useQuery({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
  });

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

  // 显示执行模态框
  const showExecuteModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    executeForm.resetFields();
    setCheckAll(false);
    setIndeterminate(false);
    setIsExecuteModalVisible(true);
  };

  // 关闭执行模态框
  const handleExecuteCancel = () => {
    setIsExecuteModalVisible(false);
    setSelectedTaskId(null);
    executeForm.resetFields();
    setCheckAll(false);
    setIndeterminate(false);
  };

  // 处理执行任务
  const handleExecute = (values: { serverIds: number[] }) => {
    if (selectedTaskId) {
      executeMutation.mutate({
        taskId: selectedTaskId,
        serverIds: values.serverIds,
        priority: 0, // 默认优先级
      });
    }
  };

  // 处理查看历史
  const handleViewHistory = (taskId: number) => {
    navigate(`/executions?taskId=${taskId}`);
  };

  // 处理全选
  const onCheckAllChange = (e: any) => {
    const checked = e.target.checked;
    const allServerIds = servers?.map((server) => server.id) || [];
    
    executeForm.setFieldsValue({
      serverIds: checked ? allServerIds : [],
    });
    
    setCheckAll(checked);
    setIndeterminate(false);
  };

  // 处理选择变化
  const onServerSelectChange = (selectedServerIds: number[]) => {
    const allServerIds = servers?.map((server) => server.id) || [];
    setIndeterminate(
      selectedServerIds.length > 0 && selectedServerIds.length < allServerIds.length
    );
    setCheckAll(selectedServerIds.length === allServerIds.length);
  };

  return {
    executeForm,
    isExecuteModalVisible,
    selectedTaskId,
    servers,
    checkAll,
    indeterminate,
    showExecuteModal,
    handleExecuteCancel,
    handleExecute,
    handleViewHistory,
    onCheckAllChange,
    onServerSelectChange,
    executeMutation,
  };
};
