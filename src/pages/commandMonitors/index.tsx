import React, { useState } from "react";
import { Button, Form, Typography, Modal } from "antd";
import { message } from "../../utils/message";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commandMonitorsApi } from "../../api/commandMonitors";
import { CommandMonitorEntity, UpdateCommandMonitorDto } from "../../types/api";
import { ID } from "../../types/common";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import { useModalForm } from "../../hooks/useModalForm";
import CommandMonitorList from "./CommandMonitorList";
import CommandMonitorForm from "./CommandMonitorForm";
import CommandMonitorHistory from "./CommandMonitorHistory";
import usePaginatedMonitors from "./hooks/usePaginatedMonitors";
import usePaginatedServers from "./hooks/usePaginatedServers";

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

  // 使用分页Hook获取命令监控
  const {
    monitors,
    isLoading,
    pagination,
    handleTableChange,
    refetch: refetchMonitors,
  } = usePaginatedMonitors();

  // 使用分页Hook获取服务器
  const { servers } = usePaginatedServers();

  // 获取命令监控执行历史
  const { data: monitorExecutions, isLoading: executionsLoading } = useQuery({
    queryKey: ["commandMonitorExecutions", selectedMonitorId],
    queryFn: () => {
      if (!selectedMonitorId)
        return Promise.resolve({
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        }); // Return empty pagination structure
      // 使用默认页面大小，考虑稍后添加分页控件
      return commandMonitorsApi.getCommandMonitorExecutionsPaginated(
        selectedMonitorId,
        { page: 1, pageSize: DEFAULT_PAGE_SIZE }
      );
    },
    select: (data) => data.items, // Select only the items array
    enabled: !!selectedMonitorId,
  });

  // 创建命令监控
  const createMutation = useMutation({
    mutationFn: commandMonitorsApi.createCommandMonitor,
    onSuccess: () => {
      // 使用更精确的查询键使缓存失效
      queryClient.invalidateQueries({
        queryKey: ["commandMonitors", "paginated"],
      });
      message.success("命令监控创建成功");
      hideModal();
      // 刷新数据
      refetchMonitors();
    },
  });

  // 更新命令监控
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: ID; data: UpdateCommandMonitorDto }) =>
      commandMonitorsApi.updateCommandMonitor(id, data),
    onSuccess: () => {
      // 使用更精确的查询键使缓存失效
      queryClient.invalidateQueries({
        queryKey: ["commandMonitors", "paginated"],
      });
      message.success("命令监控更新成功");
      hideModal();
      // 刷新数据
      refetchMonitors();
    },
  });

  // 删除命令监控
  const deleteMutation = useMutation({
    mutationFn: commandMonitorsApi.deleteCommandMonitor,
    onSuccess: () => {
      // 使用更精确的查询键使缓存失效
      queryClient.invalidateQueries({
        queryKey: ["commandMonitors", "paginated"],
      });
      message.success("命令监控删除成功");
      // 刷新数据
      refetchMonitors();
    },
  });

  // 启用命令监控
  const enableMutation = useMutation({
    mutationFn: commandMonitorsApi.enableCommandMonitor,
    onSuccess: () => {
      // 使用更精确的查询键使缓存失效
      queryClient.invalidateQueries({
        queryKey: ["commandMonitors", "paginated"],
      });
      message.success("命令监控已启用");
      // 刷新数据
      refetchMonitors();
    },
  });

  // 禁用命令监控
  const disableMutation = useMutation({
    mutationFn: commandMonitorsApi.disableCommandMonitor,
    onSuccess: () => {
      // 使用更精确的查询键使缓存失效
      queryClient.invalidateQueries({
        queryKey: ["commandMonitors", "paginated"],
      });
      message.success("命令监控已禁用");
      // 刷新数据
      refetchMonitors();
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
  const showHistoryDrawer = (monitorId: string | number) => {
    setSelectedMonitorId(
      typeof monitorId === "string" ? parseInt(monitorId, 10) : monitorId
    );
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

      {/* 监控列表（带分页） */}
      <CommandMonitorList
        monitors={monitors}
        isLoading={isLoading}
        servers={servers}
        onEdit={showModal}
        onViewHistory={showHistoryDrawer}
        onEnable={enableMutation.mutate}
        onDisable={disableMutation.mutate}
        onDelete={deleteMutation.mutate}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* 创建/编辑模态框 */}
      <Modal
        title={isEditMode ? "编辑命令监控" : "创建命令监控"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={hideModal}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
        destroyOnClose
        forceRender={true}
      >
        <Form form={form} onFinish={handleSubmit}>
          <CommandMonitorForm
            form={form}
            isEditMode={isEditMode}
            servers={servers}
            onSubmit={handleSubmit}
          />
        </Form>
      </Modal>

      {/* 执行历史抽屉 */}
      <CommandMonitorHistory
        visible={isHistoryDrawerVisible}
        onClose={closeHistoryDrawer}
        monitor={getCurrentMonitor() || undefined}
        executions={monitorExecutions}
        isLoading={executionsLoading}
        onExecutionsChange={() => {
          queryClient.invalidateQueries({
            queryKey: ["commandMonitorExecutions", selectedMonitorId],
          });
        }}
      />
    </div>
  );
};

export default CommandMonitors;
