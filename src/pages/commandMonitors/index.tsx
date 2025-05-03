import React, { useState } from "react";
import { Button, Form, Typography, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commandMonitorsApi,
  CommandMonitorEntity,
} from "../../api/commandMonitors";
import { serversApi } from "../../api/servers";
import { useModalForm } from "../../hooks/useModalForm";
import CommandMonitorList from "./CommandMonitorList";
import CommandMonitorForm from "./CommandMonitorForm";
import CommandMonitorHistory from "./CommandMonitorHistory";

/**
 * 命令监控页面组件
 *
 * 整合了命令监控列表、表单和历史记录组件
 */
const CommandMonitors: React.FC = () => {
  // 状态
  const [isHistoryDrawerVisible, setIsHistoryDrawerVisible] = useState(false);
  const [selectedMonitorId, setSelectedMonitorId] = useState<number | null>(
    null
  );

  // 查询客户端
  const queryClient = useQueryClient();

  // 表单Hook
  const {
    form,
    visible: isModalVisible,
    isEditMode,
    editingEntity: selectedMonitor,
    showModal,
    hideModal,
  } = useModalForm<CommandMonitorEntity>({
    initialValues: { enabled: true },
  });

  // 获取所有命令监控
  const { data: monitors, isLoading } = useQuery({
    queryKey: ["commandMonitors"],
    queryFn: commandMonitorsApi.getAllCommandMonitors,
  });

  // 获取所有服务器
  const { data: servers } = useQuery({
    queryKey: ["servers"],
    queryFn: serversApi.getAllServers,
  });

  // 获取命令监控执行历史
  const { data: monitorExecutions, isLoading: executionsLoading } = useQuery({
    queryKey: ["commandMonitorExecutions", selectedMonitorId],
    queryFn: () =>
      selectedMonitorId
        ? commandMonitorsApi.getCommandMonitorExecutions(selectedMonitorId)
        : Promise.resolve([]),
    enabled: !!selectedMonitorId,
  });

  // 创建命令监控
  const createMutation = useMutation({
    mutationFn: commandMonitorsApi.createCommandMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandMonitors"] });
      message.success("命令监控创建成功");
      hideModal();
    },
  });

  // 更新命令监控
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      commandMonitorsApi.updateCommandMonitor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandMonitors"] });
      message.success("命令监控更新成功");
      hideModal();
    },
  });

  // 删除命令监控
  const deleteMutation = useMutation({
    mutationFn: commandMonitorsApi.deleteCommandMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandMonitors"] });
      message.success("命令监控删除成功");
    },
  });

  // 启用命令监控
  const enableMutation = useMutation({
    mutationFn: commandMonitorsApi.enableCommandMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandMonitors"] });
      message.success("命令监控已启用");
    },
  });

  // 禁用命令监控
  const disableMutation = useMutation({
    mutationFn: commandMonitorsApi.disableCommandMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandMonitors"] });
      message.success("命令监控已禁用");
    },
  });

  // 处理表单提交
  const handleSubmit = (values: any) => {
    if (selectedMonitor) {
      updateMutation.mutate({
        id: selectedMonitor.id,
        data: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  // 显示执行历史抽屉
  const showHistoryDrawer = (monitorId: number) => {
    setSelectedMonitorId(monitorId);
    setIsHistoryDrawerVisible(true);
  };

  // 关闭执行历史抽屉
  const closeHistoryDrawer = () => {
    setIsHistoryDrawerVisible(false);
    setSelectedMonitorId(null);
  };

  // 获取当前选中的监控
  const getCurrentMonitor = () => {
    if (!selectedMonitorId || !monitors) return null;
    return monitors.find((m) => m.id === selectedMonitorId) || null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={4} className="m-0">
          命令监控
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          添加监控
        </Button>
      </div>

      {/* 监控列表 */}
      <CommandMonitorList
        monitors={monitors}
        isLoading={isLoading}
        servers={servers}
        onEdit={showModal}
        onViewHistory={showHistoryDrawer}
        onEnable={enableMutation.mutate}
        onDisable={disableMutation.mutate}
        onDelete={deleteMutation.mutate}
      />

      {/* 创建/编辑模态框 */}
      <Modal
        title={isEditMode ? "编辑命令监控" : "创建命令监控"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={hideModal}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <CommandMonitorForm
          form={form}
          isEditMode={isEditMode}
          servers={servers}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* 执行历史抽屉 */}
      <CommandMonitorHistory
        visible={isHistoryDrawerVisible}
        onClose={closeHistoryDrawer}
        monitor={getCurrentMonitor()}
        executions={monitorExecutions}
        isLoading={executionsLoading}
      />
    </div>
  );
};

export default CommandMonitors;
