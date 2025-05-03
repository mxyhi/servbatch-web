import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  serversApi,
  ImportServersResultDto,
  CreateServerDto,
} from "../api/servers";
import { ImportFormat, ConnectionType } from "../constants";

interface UseServerImportResult {
  // 导入格式状态
  importFormat: ImportFormat;
  setImportFormat: (format: ImportFormat) => void;

  // 导入结果
  importResult: ImportServersResultDto | null;
  resetImportResult: () => void;

  // 导入操作
  importServers: (data: string) => Promise<void>;
  isImporting: boolean;

  // 解析函数
  parseTextFormat: (text: string) => CreateServerDto[];

  // 示例数据
  getExampleData: (format: ImportFormat) => string;
}

/**
 * 自定义Hook，用于管理服务器导入功能
 *
 * 提供服务器导入相关的状态和操作函数，包括格式选择、数据解析和导入操作
 *
 * @returns {UseServerImportResult} 导入相关状态和函数
 */
export const useServerImport = (): UseServerImportResult => {
  const [importFormat, setImportFormat] = useState<ImportFormat>(
    ImportFormat.JSON
  );
  const [importResult, setImportResult] =
    useState<ImportServersResultDto | null>(null);
  const queryClient = useQueryClient();

  // 导入服务器
  const importMutation = useMutation({
    mutationFn: serversApi.importServers,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      setImportResult(data);
      message.success(`成功导入 ${data.successCount} 个服务器`);
      if (data.failureCount > 0) {
        message.warning(`${data.failureCount} 个服务器导入失败`);
      }
    },
    onError: (error) => {
      message.error(
        `导入失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 使用useMemo缓存字段顺序定义，避免重复创建
  const fieldOrder = useMemo(
    () => [
      "name",
      "host",
      "port",
      "user",
      "pwd",
      "key",
      "connectionType",
      "proxyId",
    ],
    []
  );

  // 解析文本格式的服务器数据
  const parseTextFormat = useCallback(
    (text: string): CreateServerDto[] => {
      // 分割行
      const lines = text.trim().split(/\r?\n/);
      if (lines.length === 0) {
        throw new Error("没有数据行");
      }

      // 解析数据行
      const servers: CreateServerDto[] = [];
      for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // 跳过空行

        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length > fieldOrder.length) {
          throw new Error(
            `第 ${i + 1} 行的列数超过了预期的 ${fieldOrder.length} 列`
          );
        }

        const server: Partial<CreateServerDto> = {};
        values.forEach((value, index) => {
          if (!value) return; // 跳过空值

          const field = fieldOrder[index];
          if (field === "port") {
            server.port = parseInt(value, 10);
          } else if (field === "user") {
            server.username = value;
          } else if (field === "pwd") {
            server.password = value;
          } else if (field === "key") {
            server.privateKey = value;
          } else if (field === "connectionType") {
            server.connectionType =
              value === "proxy" ? ConnectionType.PROXY : ConnectionType.DIRECT;
          } else if (field === "proxyId") {
            server.proxyId = value;
          } else if (field === "name") {
            server.name = value;
          } else if (field === "host") {
            server.host = value;
          }
        });

        // 检查必要的字段
        if (!server.name || !server.host || !server.username) {
          throw new Error(
            `第 ${i + 1} 行缺少必要的字段: name, host 或 username`
          );
        }

        servers.push(server as CreateServerDto);
      }

      return servers;
    },
    [fieldOrder]
  );

  // 导入服务器数据
  const importServers = useCallback(
    async (serversData: string): Promise<void> => {
      try {
        let parsedData;

        if (importFormat === ImportFormat.JSON) {
          parsedData = JSON.parse(serversData);
        } else {
          parsedData = parseTextFormat(serversData);
        }

        await importMutation.mutateAsync({ servers: parsedData });
      } catch (error) {
        message.error(
          `格式错误: ${error instanceof Error ? error.message : "未知错误"}`
        );
        throw error;
      }
    },
    [importFormat, parseTextFormat, importMutation]
  );

  // 重置导入结果
  const resetImportResult = useCallback(() => {
    setImportResult(null);
  }, []);

  // 获取示例数据
  const getExampleData = useCallback((format: ImportFormat): string => {
    if (format === ImportFormat.JSON) {
      return `[
  {
    "name": "测试服务器1",
    "host": "192.168.1.1",
    "port": 22,
    "username": "root",
    "password": "password123",
    "connectionType": "direct"
  },
  {
    "name": "测试服务器2",
    "host": "192.168.1.2",
    "port": 22,
    "username": "admin",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----",
    "connectionType": "proxy",
    "proxyId": "1"
  }
]`;
    } else {
      return `测试服务器1,192.168.1.1,22,root,password123,,direct,
测试服务器2,192.168.1.2,22,admin,,-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----,proxy,1`;
    }
  }, []);

  return {
    // 导入格式状态
    importFormat,
    setImportFormat,

    // 导入结果
    importResult,
    resetImportResult,

    // 导入操作
    importServers,
    isImporting: importMutation.isPending,

    // 解析函数
    parseTextFormat,

    // 示例数据
    getExampleData,
  };
};
