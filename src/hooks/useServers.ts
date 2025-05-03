import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  serversApi,
  ServerEntity,
  CreateServerDto,
  UpdateServerDto,
} from "../api/servers";
import { DEFAULT_REFRESH_INTERVAL } from "../constants";
import { useCallback } from "react";

interface UseServersResult {
  // 数据和加载状态
  servers: ServerEntity[] | undefined;
  isLoading: boolean;

  // 服务器操作函数
  createServer: (data: CreateServerDto) => Promise<void>;
  updateServer: (id: number, data: UpdateServerDto) => Promise<void>;
  deleteServer: (id: number) => Promise<void>;
  testConnection: (id: number) => Promise<void>;

  // 操作状态
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isTestingConnection: boolean;
  testingConnectionId: number | undefined;

  // 获取单个服务器
  getServerById: (id: number) => ServerEntity | undefined;
}

/**
 * 自定义Hook，用于管理服务器数据和操作
 *
 * 提供服务器列表数据和所有服务器相关的操作函数，包括创建、更新、删除和测试连接等
 *
 * @param {boolean} autoRefresh 是否自动刷新数据
 * @param {number} refreshInterval 刷新间隔（毫秒）
 * @returns {UseServersResult} 服务器数据和操作函数
 */
export const useServers = (
  autoRefresh = false,
  refreshInterval = DEFAULT_REFRESH_INTERVAL
): UseServersResult => {
  const queryClient = useQueryClient();

  // 获取服务器列表
  const { data: servers, isLoading } = useQuery({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // 创建服务器
  const createMutation = useMutation({
    mutationFn: serversApi.createServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      message.success("服务器创建成功");
    },
    onError: (error) => {
      message.error(
        `创建失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 更新服务器
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServerDto }) =>
      serversApi.updateServer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      message.success("服务器更新成功");
    },
    onError: (error) => {
      message.error(
        `更新失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 删除服务器
  const deleteMutation = useMutation({
    mutationFn: serversApi.deleteServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      message.success("服务器删除成功");
    },
    onError: (error) => {
      message.error(
        `删除失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 测试连接
  const testConnectionMutation = useMutation({
    mutationFn: serversApi.testConnection,
    onSuccess: () => {
      message.success("连接测试成功");
      queryClient.invalidateQueries({ queryKey: ["servers"] });
    },
    onError: (error) => {
      message.error(
        `连接测试失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 使用useCallback包装操作函数，避免不必要的重新创建
  const createServer = useCallback(
    async (data: CreateServerDto): Promise<void> => {
      await createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const updateServer = useCallback(
    async (id: number, data: UpdateServerDto): Promise<void> => {
      await updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteServer = useCallback(
    async (id: number): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const testConnection = useCallback(
    async (id: number): Promise<void> => {
      await testConnectionMutation.mutateAsync(id);
    },
    [testConnectionMutation]
  );

  // 根据ID获取服务器
  const getServerById = useCallback(
    (id: number): ServerEntity | undefined => {
      return servers?.find((server) => server.id === id);
    },
    [servers]
  );

  return {
    // 数据和加载状态
    servers,
    isLoading,

    // 服务器操作函数
    createServer,
    updateServer,
    deleteServer,
    testConnection,

    // 操作状态
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTestingConnection: testConnectionMutation.isPending,
    testingConnectionId: testConnectionMutation.variables as number | undefined,

    // 获取单个服务器
    getServerById,
  };
};
