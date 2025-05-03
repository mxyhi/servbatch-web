import { useQuery } from "@tanstack/react-query";
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

/**
 * 服务器管理Hook
 *
 * 封装了服务器相关的数据获取和操作逻辑
 *
 * @param autoRefresh 是否自动刷新
 * @param refreshInterval 刷新间隔（毫秒）
 * @returns 服务器数据和操作方法
 */
export const useServers = (
  autoRefresh: boolean = false,
  refreshInterval: number = DEFAULT_REFRESH_INTERVAL
) => {
  // 获取服务器列表
  const {
    data: servers,
    isLoading,
    refetch,
  } = useQuery<ServerEntity[]>({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

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
