import {
  serversApi,
  ServerEntity,
  CreateServerDto,
  UpdateServerDto,
  ImportServersResultDto,
} from "../../../api/servers";
import { DEFAULT_REFRESH_INTERVAL } from "../../../constants";
import { useCrudOperations } from "../../../hooks/useCrudOperations";
import { message } from "../../../utils/message";
import { useEffect, useRef } from "react";
import usePaginatedServersData from "./usePaginatedServersData";

/**
 * 服务器管理Hook
 *
 * 封装了服务器相关的数据获取和操作逻辑
 *
 * @param autoRefresh 是否自动刷新
 * @param refreshInterval 刷新间隔（毫秒）
 * @param autoTestConnection 是否在自动刷新时测试服务器连接
 * @returns 服务器数据和操作方法
 */
export const useServers = (
  autoRefresh: boolean = false,
  refreshInterval: number = DEFAULT_REFRESH_INTERVAL,
  autoTestConnection: boolean = true
) => {
  // 使用分页Hook获取服务器数据
  const { servers, isLoading, refetch } = usePaginatedServersData();

  // 使用通用CRUD操作Hook
  const { createMutation, updateMutation, deleteMutation } = useCrudOperations<
    ServerEntity,
    CreateServerDto,
    UpdateServerDto
  >(
    {
      create: serversApi.createServer,
      update: serversApi.updateServer,
      delete: serversApi.deleteServer,
    },
    ["servers"],
    {
      createSuccess: "服务器创建成功",
      updateSuccess: "服务器更新成功",
      deleteSuccess: "服务器删除成功",
    }
  );

  // 测试服务器连接
  const testConnectionMutation = useCrudOperations<void, number, never>(
    {
      create: serversApi.testConnection,
      update: () => Promise.reject("不支持的操作"),
      delete: () => Promise.reject("不支持的操作"),
    },
    ["servers"],
    {
      createSuccess: "连接测试成功",
      createError: "连接测试失败",
    }
  ).createMutation;

  // 批量导入服务器
  const importServersMutation = useCrudOperations<
    ImportServersResultDto,
    { servers: any[] },
    never
  >(
    {
      create: serversApi.importServers,
      update: () => Promise.reject("不支持的操作"),
      delete: () => Promise.reject("不支持的操作"),
    },
    ["servers"],
    {
      createSuccess: "服务器导入成功",
      createError: "服务器导入失败",
    }
  ).createMutation;

  // 自定义导入成功处理
  importServersMutation.mutate = (data) => {
    const originalMutate = importServersMutation.mutate;
    originalMutate(data, {
      onSuccess: (result) => {
        message.success(`成功导入 ${result.successCount} 个服务器`);
        if (result.failureCount > 0) {
          message.warning(`${result.failureCount} 个服务器导入失败`);
        }
      },
    });
  };

  // 上次刷新时间的引用
  const lastRefreshTimeRef = useRef<number>(0);
  // 测试连接中的服务器ID集合
  const testingServersRef = useRef<Set<number>>(new Set());

  // 自动测试服务器连接
  useEffect(() => {
    // 如果没有开启自动刷新或自动测试连接，或者没有服务器数据，则不执行
    if (
      !autoRefresh ||
      !autoTestConnection ||
      !servers ||
      servers.length === 0
    ) {
      return;
    }

    // 计算距离上次刷新的时间间隔
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;

    // 如果距离上次刷新的时间小于刷新间隔的一半，则不执行
    // 这是为了防止频繁测试连接
    if (
      timeSinceLastRefresh < refreshInterval / 2 &&
      lastRefreshTimeRef.current !== 0
    ) {
      return;
    }

    // 更新上次刷新时间
    lastRefreshTimeRef.current = now;

    // 测试所有服务器连接
    // 使用setTimeout错开测试时间，避免同时发起太多请求
    servers.forEach((server, index) => {
      // 如果该服务器已经在测试中，则跳过
      if (testingServersRef.current.has(server.id)) {
        return;
      }

      // 添加到测试中的集合
      testingServersRef.current.add(server.id);

      // 错开测试时间，每个服务器间隔200ms
      setTimeout(() => {
        // 测试连接
        testConnectionMutation.mutate(server.id, {
          onSettled: () => {
            // 测试完成后从集合中移除
            testingServersRef.current.delete(server.id);
          },
        });
      }, index * 200);
    });
  }, [
    autoRefresh,
    autoTestConnection,
    servers,
    refreshInterval,
    testConnectionMutation,
  ]);

  return {
    servers,
    isLoading,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    testConnectionMutation,
    importServersMutation,
  };
};
