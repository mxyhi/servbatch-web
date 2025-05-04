import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "../../../utils/message";
import {
  tasksApi,
  TaskEntity,
  CreateTaskDto,
  UpdateTaskDto,
  TaskPaginationParams,
} from "../../../api/tasks";
import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../../../constants";
import { TablePaginationConfig } from "antd/es/table";

/**
 * 处理任务数据获取和操作的自定义Hook
 */
export const useTasks = () => {
  const queryClient = useQueryClient();

  // 分页状态
  const [pagination, setPagination] = useState<TaskPaginationParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // 获取任务列表（分页）
  const { data: tasksPaginated, isLoading } = useQuery({
    queryKey: ["tasks", "paginated", pagination],
    queryFn: () => tasksApi.getTasksPaginated(pagination),
  });

  // 提取任务列表
  const tasks = tasksPaginated?.items || [];

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

  // 处理表格分页变化
  const handleTableChange = (tablePagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
      page: tablePagination.current || 1,
      pageSize: tablePagination.pageSize || DEFAULT_PAGE_SIZE,
    });
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
    // 分页相关
    pagination: {
      current: tasksPaginated?.page || 1,
      pageSize: tasksPaginated?.pageSize || DEFAULT_PAGE_SIZE,
      total: tasksPaginated?.total || 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条记录`,
    },
    handleTableChange,
  };
};
