import React from "react";
import { Input, Switch, Select, Form } from "antd";
import { CommandMonitorEntity } from "../../api/commandMonitors";
import { EntityForm, EntityFormItem } from "../../components/entity";

const { TextArea } = Input;

interface CommandMonitorFormProps {
  form: any;
  isEditMode: boolean;
  servers?: any[];
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
}

/**
 * 命令监控表单组件
 */
const CommandMonitorForm: React.FC<CommandMonitorFormProps> = ({
  form,
  isEditMode,
  servers = [],
  onSubmit,
  onCancel,
}) => {
  // 表单项配置
  const formItems: EntityFormItem[] = [
    {
      name: "name",
      label: "监控名称",
      component: <Input placeholder="请输入监控名称" />,
      rules: [{ required: true, message: "请输入监控名称" }],
    },
    {
      name: "description",
      label: "监控描述",
      component: <TextArea rows={2} placeholder="请输入监控描述" />,
    },
    {
      name: "checkCommand",
      label: "检查命令",
      component: <TextArea rows={2} placeholder="请输入检查命令" />,
      rules: [{ required: true, message: "请输入检查命令" }],
      tooltip: "此命令用于检查服务是否正常运行，如果返回非0状态码，则执行修复命令",
    },
    {
      name: "executeCommand",
      label: "执行命令",
      component: <TextArea rows={2} placeholder="请输入执行命令" />,
      rules: [{ required: true, message: "请输入执行命令" }],
      tooltip: "当检查命令返回非0状态码时，将执行此命令",
    },
    {
      name: "serverId",
      label: "服务器",
      component: (
        <Select placeholder="请选择服务器">
          {servers.map((server) => (
            <Select.Option key={server.id} value={server.id}>
              {server.name} ({server.host})
            </Select.Option>
          ))}
        </Select>
      ),
      rules: [{ required: true, message: "请选择服务器" }],
    },
    {
      name: "enabled",
      label: "是否启用",
      component: <Switch />,
      valuePropName: "checked",
    },
  ];

  return (
    <EntityForm
      form={form}
      isEditMode={isEditMode}
      items={formItems}
      onSubmit={onSubmit}
      onCancel={onCancel}
      showSubmitButton={false}
      showResetButton={false}
      showCancelButton={false}
    />
  );
};

export default React.memo(CommandMonitorForm);
