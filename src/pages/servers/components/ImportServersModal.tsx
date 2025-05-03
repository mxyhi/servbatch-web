import React, { useState, useEffect } from "react";
import { Form, Input, Button, Space, Alert, message, FormInstance } from "antd";
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
  form?: FormInstance;
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
    form.resetFields();
    setImportResult(null);
  };

  const handleImport = () => {
    form.validateFields().then((values) => {
      try {
        let serversData;

        if (importFormat === ImportFormat.JSON) {
          serversData = JSON.parse(values.serversData);
        } else {
          serversData = parseTextFormat(values.serversData);
        }

        importServersMutation.mutate({ servers: serversData });
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
  const textExample = `测试服务器1,192.168.1.1,22,root,password123,,direct,
测试服务器2,192.168.1.2,22,admin,,-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----,proxy,1`;

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
      <Form.Item label="导入格式">
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
            : "请输入CSV格式的服务器数据，每行一个服务器，格式为：name,host,port,user,pwd,key,connectionType,proxyId"
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
