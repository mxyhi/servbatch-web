import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Space, Alert, FormInstance } from "antd";
import { message } from "../../../utils/message";
import { ImportServersResultDto } from "../../../api/servers";
import { UseMutationResult } from "@tanstack/react-query";
import { parseTextFormat } from "../utils/serverUtils";
import { FormModal } from "../../../components/common";
import { ImportFormat } from "../../../constants";

interface ImportServersModalProps {
  isImportModalVisible: boolean;
  setIsImportModalVisible: (visible: boolean) => void;
  importServersMutation: UseMutationResult<
    ImportServersResultDto,
    Error,
    { servers: any[] },
    unknown
  >;
  form?: FormInstance; // 添加外部表单实例参数
}

const ImportServersModal: React.FC<ImportServersModalProps> = ({
  isImportModalVisible,
  setIsImportModalVisible,
  importServersMutation,
  form: externalForm,
}) => {
  // 使用外部传入的表单实例或创建新的表单实例
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  // 使用 useRef 跟踪模态框之前的可见状态
  const prevVisibleRef = useRef<boolean | undefined>(undefined);

  // 更新之前的可见状态
  useEffect(() => {
    prevVisibleRef.current = isImportModalVisible;
  }, [isImportModalVisible]);

  // 在模态框显示/隐藏时处理表单
  useEffect(() => {
    // 当模态框变为可见时
    if (isImportModalVisible) {
      // 设置初始值
      form.setFieldsValue({ format: ImportFormat.JSON });
    }
    // 当模态框从可见变为不可见时
    else if (prevVisibleRef.current) {
      // 重置表单
      form.resetFields();
    }
  }, [isImportModalVisible, form]);

  const [importResult, setImportResult] =
    useState<ImportServersResultDto | null>(null);
  const [importFormat, setImportFormat] = useState<ImportFormat>(
    ImportFormat.JSON
  );

  // 监听导入结果
  useEffect(() => {
    if (importServersMutation.data) {
      setImportResult(importServersMutation.data);
    }
  }, [importServersMutation.data]);

  // 监听模态框关闭
  useEffect(() => {
    if (!isImportModalVisible) {
      setImportResult(null);
    }
  }, [isImportModalVisible]);

  const handleImportCancel = () => {
    setIsImportModalVisible(false);
    setImportResult(null);
  };

  const handleImport = () => {
    form.validateFields().then((values) => {
      try {
        // 检查数据是否为空
        if (!values.serversData || values.serversData.trim() === "") {
          throw new Error("请输入服务器数据");
        }

        let serversData;

        if (importFormat === ImportFormat.JSON) {
          try {
            // 限制JSON数据大小
            const maxLength = 100000;
            if (values.serversData.length > maxLength) {
              throw new Error(
                `JSON数据过大，请分批导入（最大${maxLength}字符）`
              );
            }

            // 解析JSON
            serversData = JSON.parse(values.serversData);

            // 验证JSON数据是否为数组
            if (!Array.isArray(serversData)) {
              throw new Error("JSON数据必须是服务器对象的数组");
            }

            // 验证数组中的每个对象
            for (let i = 0; i < serversData.length; i++) {
              const server = serversData[i];
              if (!server || typeof server !== "object") {
                throw new Error(`第${i + 1}个服务器数据无效，必须是对象`);
              }
              if (!server.name)
                throw new Error(`第${i + 1}个服务器缺少name字段`);
              if (!server.host)
                throw new Error(`第${i + 1}个服务器缺少host字段`);
              if (!server.username)
                throw new Error(`第${i + 1}个服务器缺少username字段`);
            }
          } catch (jsonError) {
            throw new Error(
              `JSON解析错误: ${
                jsonError instanceof Error
                  ? jsonError.message
                  : "无效的JSON格式"
              }`
            );
          }
        } else {
          try {
            // 限制文本数据大小
            const maxLength = 50000;
            if (values.serversData.length > maxLength) {
              throw new Error(
                `文本数据过大，请分批导入（最大${maxLength}字符）`
              );
            }

            // 使用优化后的parseTextFormat函数解析文本数据
            serversData = parseTextFormat(values.serversData);
          } catch (textError) {
            throw new Error(
              `${
                textError instanceof Error
                  ? textError.message
                  : "无效的文本格式"
              }`
            );
          }
        }

        // 验证服务器数据
        if (
          !serversData ||
          !Array.isArray(serversData) ||
          serversData.length === 0
        ) {
          throw new Error("没有有效的服务器数据");
        }

        // 限制单次导入的服务器数量
        const maxServers = 100;
        if (serversData.length > maxServers) {
          throw new Error(
            `单次导入服务器数量过多，请分批导入（最大${maxServers}个）`
          );
        }

        // 使用Promise和setTimeout的组合来避免堆栈溢出
        // 首先创建一个延迟执行的Promise
        const delayedExecution = () => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 10); // 使用稍长的延迟以确保堆栈被清空
          });
        };

        // 然后在Promise解析后执行导入操作
        delayedExecution()
          .then(() => {
            // 如果数据量较大，分批处理以避免堆栈溢出
            if (serversData.length > 20) {
              message.info(
                `正在处理${serversData.length}个服务器数据，请稍候...`
              );
            }

            return importServersMutation.mutateAsync({ servers: serversData });
          })
          .catch((mutateError) => {
            message.error(
              `导入失败: ${
                mutateError instanceof Error ? mutateError.message : "未知错误"
              }`
            );
          });
      } catch (error) {
        message.error(
          `格式错误: ${error instanceof Error ? error.message : "未知错误"}`
        );
      }
    });
  };

  // JSON格式示例
  const jsonExample = `[
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

  // 文本格式示例
  const textExample = `server-1,192.168.1.1,22,root,password123,,direct,
server-2,192.168.1.2,22,admin,,-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----,proxy,proxy-1
192.168.1.3,192.168.1.3,22,root,password123,,proxy,proxy-1`;

  return (
    <FormModal
      title="批量导入服务器"
      open={isImportModalVisible}
      onOk={handleImport}
      onCancel={handleImportCancel}
      form={form}
      confirmLoading={importServersMutation.isPending}
      width={700}
      autoValidate={true}
    >
      <Form.Item label="导入格式" name="format">
        <Space>
          <Button
            type={importFormat === ImportFormat.JSON ? "primary" : "default"}
            onClick={() => {
              setImportFormat(ImportFormat.JSON);
              form.setFieldsValue({ format: ImportFormat.JSON });
            }}
          >
            JSON格式
          </Button>
          <Button
            type={importFormat === ImportFormat.TEXT ? "primary" : "default"}
            onClick={() => {
              setImportFormat(ImportFormat.TEXT);
              form.setFieldsValue({ format: ImportFormat.TEXT });
            }}
          >
            文本格式
          </Button>
        </Space>
      </Form.Item>

      <Form.Item
        name="serversData"
        label={
          importFormat === ImportFormat.JSON
            ? "服务器JSON数据"
            : "服务器文本数据"
        }
        rules={[
          {
            required: true,
            message: `请输入服务器${
              importFormat === ImportFormat.JSON ? "JSON" : "文本"
            }数据`,
          },
        ]}
        extra={
          importFormat === ImportFormat.JSON
            ? "请输入JSON格式的服务器数组，每个服务器对象包含name、host、port、username、password或privateKey、connectionType、proxyId字段"
            : "请输入CSV格式的服务器数据，每行一个服务器，格式为：name,host,port,username,password,privateKey,connectionType,proxyId（注意：1. 第一列为服务器名称，如果与第二列IP相同，系统会自动生成名称；2. 如果使用代理连接，connectionType应为'proxy'，并在proxyId中指定代理ID）"
        }
      >
        <Input.TextArea
          rows={10}
          placeholder={
            importFormat === ImportFormat.JSON ? jsonExample : textExample
          }
        />
      </Form.Item>

      {importResult && (
        <div className="mt-4">
          <Alert
            message={`导入结果: 成功 ${importResult.successCount} 个, 失败 ${importResult.failureCount} 个`}
            type={importResult.failureCount > 0 ? "warning" : "success"}
            showIcon
          />

          {importResult.failureCount > 0 && (
            <div className="mt-2">
              <h4>失败详情:</h4>
              <ul>
                {importResult.failureServers.map((failure, index) => (
                  <li key={index}>
                    {failure.server.name} ({failure.server.host}):{" "}
                    {failure.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </FormModal>
  );
};

export default React.memo(ImportServersModal);
