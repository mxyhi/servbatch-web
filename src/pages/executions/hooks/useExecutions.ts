import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "../../../utils/message";
import { executionsApi } from "../../../api/executions";
import { CleanupByDateDto, CleanupByStatusDto } from "../../../types/api";

interface UseExecutionsProps {
  taskId?: number | null;
  serverId?: number | null;
}

/**
 * 处理执行记录的数据获取和操作的自定义Hook
 */
export const useExecutions = ({
  taskId,
  serverId,
}: UseExecutionsProps = {}) => {
  const queryClient = useQueryClient();

  // 获取执行记录
  const { data: executions, isLoading } = useQuery({
    queryKey: ["executions", { taskId, serverId }],
    queryFn: async () => {
      if (taskId) {
        return executionsApi.getExecutionsByTaskIdPaginated(taskId);
      } else if (serverId) {
        return executionsApi.getExecutionsByServerIdPaginated(serverId);
      } else {
        return executionsApi.getExecutionsPaginated();
      }
    },
  });

  // 删除执行记录
  const deleteMutation = useMutation({
    mutationFn: executionsApi.deleteExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success("执行记录删除成功");
    },
    onError: (error) => {
      message.error(
        `删除失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 取消执行中的任务
  const cancelMutation = useMutation({
    mutationFn: executionsApi.cancelExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success("任务已取消");
    },
    onError: (error) => {
      message.error(
        `取消失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据日期清理
  const cleanupByDateMutation = useMutation({
    mutationFn: executionsApi.cleanupByDate,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据状态清理
  const cleanupByStatusMutation = useMutation({
    mutationFn: executionsApi.cleanupByStatus,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据任务ID清理
  const cleanupByTaskIdMutation = useMutation({
    mutationFn: executionsApi.cleanupByTaskId,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 根据服务器ID清理
  const cleanupByServerIdMutation = useMutation({
    mutationFn: executionsApi.cleanupByServerId,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
      message.success(`成功清理 ${result.deletedCount} 条执行记录`);
    },
    onError: (error) => {
      message.error(
        `清理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 处理删除
  const handleDelete = (id: string | number) => {
    deleteMutation.mutate(id);
  };

  // 处理取消
  const handleCancel = (id: string | number) => {
    cancelMutation.mutate(id);
  };

  // 处理根据日期清理
  const handleCleanupByDate = (data: CleanupByDateDto) => {
    cleanupByDateMutation.mutate(data);
  };

  // 处理根据状态清理
  const handleCleanupByStatus = (data: CleanupByStatusDto) => {
    cleanupByStatusMutation.mutate(data);
  };

  // 处理根据任务ID清理
  const handleCleanupByTaskId = (taskId: number) => {
    cleanupByTaskIdMutation.mutate(taskId);
  };

  // 处理根据服务器ID清理
  const handleCleanupByServerId = (serverId: number) => {
    cleanupByServerIdMutation.mutate(serverId);
  };

  return {
    executions,
    isLoading,
    handleDelete,
    handleCancel,
    handleCleanupByDate,
    handleCleanupByStatus,
    handleCleanupByTaskId,
    handleCleanupByServerId,
    deleteMutation,
    cancelMutation,
    cleanupByDateMutation,
    cleanupByStatusMutation,
    cleanupByTaskIdMutation,
    cleanupByServerIdMutation,
  };
};
