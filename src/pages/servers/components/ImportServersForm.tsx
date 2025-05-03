import React, { useState } from "react";
import { Form, Input, Button, Space, Alert, FormInstance } from "antd";
import { ImportServersResultDto } from "../../../api/servers";

interface ImportServersFormProps {
  form: FormInstance;
  importResult: ImportServersResultDto | null;
  onFormatChange: (format: "json" | "text") => void;
}

const ImportServersForm: React.FC<ImportServersFormProps> = ({
  form,
  importResult,
  onFormatChange,
}) => {
  const [importFormat, setImportFormat] = useState<"json" | "text">("json");

  const handleFormatChange = (format: "json" | "text") => {
    setImportFormat(format);
    onFormatChange(format);
    form.setFieldsValue({ format });
  };

  return (
    <>
      <Form.Item label="导入格式">
        <Space>
          <Button
            type={importFormat === "json" ? "primary" : "default"}
            onClick={() => handleFormatChange("json")}
          >
            JSON格式
          </Button>
          <Button
            type={importFormat === "text" ? "primary" : "default"}
            onClick={() => handleFormatChange("text")}
          >
            文本格式
          </Button>
        </Space>
      </Form.Item>

      <Form.Item
        name="serversData"
        label={importFormat === "json" ? "服务器JSON数据" : "服务器文本数据"}
        rules={[
          {
            required: true,
            message: `请输入服务器${
              importFormat === "json" ? "JSON" : "文本"
            }数据`,
          },
        ]}
        extra={
          importFormat === "json"
            ? "请输入JSON格式的服务器数组，每个服务器对象包含name、host、port、username、password或privateKey、connectionType、proxyId字段"
            : "请输入CSV格式的服务器数据，每行一个服务器，格式为：name,host,port,user,pwd,key,connectionType,proxyId"
        }
      >
        <Input.TextArea
          rows={10}
          placeholder={
            importFormat === "json"
              ? `[
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
]`
              : `测试服务器1,192.168.1.1,22,root,password123,,direct,
测试服务器2,192.168.1.2,22,admin,,-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----,proxy,1`
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
                    {failure.server.name} ({failure.server.host}): {failure.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImportServersForm;
