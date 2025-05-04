import React from "react";
import { Input, Switch, Select, Form } from "antd";
import { ServerEntity } from "../../types/api";

const { TextArea } = Input;
const { Item } = Form;

interface CommandMonitorFormProps {
  form?: any;
  isEditMode?: boolean;
  servers?: ServerEntity[];
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
}

/**
 * 命令监控表单组件
 */
const CommandMonitorForm: React.FC<CommandMonitorFormProps> = ({
  servers = [],
}) => {
  return (
    <>
      <Item
        name="name"
        label="监控名称"
        rules={[{ required: true, message: "请输入监控名称" }]}
      >
        <Input placeholder="请输入监控名称" />
      </Item>

      <Item name="description" label="监控描述">
        <TextArea rows={2} placeholder="请输入监控描述" />
      </Item>

      <Item
        name="checkCommand"
        label="检查命令"
        rules={[{ required: true, message: "请输入检查命令" }]}
        tooltip="此命令用于检查服务是否正常运行，如果返回非0状态码，则执行修复命令"
      >
        <TextArea rows={2} placeholder="请输入检查命令" />
      </Item>

      <Item
        name="executeCommand"
        label="执行命令"
        rules={[{ required: true, message: "请输入执行命令" }]}
        tooltip="当检查命令返回非0状态码时，将执行此命令"
      >
        <TextArea rows={2} placeholder="请输入执行命令" />
      </Item>

      <Item
        name="serverId"
        label="服务器"
        rules={[{ required: true, message: "请选择服务器" }]}
      >
        <Select placeholder="请选择服务器">
          {servers.map((server) => (
            <Select.Option key={server.id} value={server.id}>
              {server.name} ({server.host})
            </Select.Option>
          ))}
        </Select>
      </Item>

      <Item name="enabled" label="是否启用" valuePropName="checked">
        <Switch />
      </Item>
    </>
  );
};

export default React.memo(CommandMonitorForm);
