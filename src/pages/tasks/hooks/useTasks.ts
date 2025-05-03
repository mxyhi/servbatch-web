import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "../../../utils/message";
import {
  tasksApi,
  TaskEntity,
  CreateTaskDto,
  UpdateTaskDto,
} from "../../../api/tasks";

/**
 * 处理任务数据获取和操作的自定义Hook
 */
export const useTasks = () => {
  const queryClient = useQueryClient();

  // 获取任务列表
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAllTasks,
  });

  // 创建任务
  const createMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("任务创建成功");
    },
    onError: (error) => {
      message.error(
        `创建失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 更新任务
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("任务更新成功");
    },
    onError: (error) => {
      message.error(
        `更新失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 删除任务
  const deleteMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("任务删除成功");
    },
    onError: (error) => {
      message.error(
        `删除失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 处理创建任务
  const handleCreate = (data: CreateTaskDto) => {
    createMutation.mutate(data);
    return createMutation.isPending;
  };

  // 处理更新任务
  const handleUpdate = (id: number, data: UpdateTaskDto) => {
    updateMutation.mutate({ id, data });
    return updateMutation.isPending;
  };

  // 处理删除任务
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    tasks,
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
