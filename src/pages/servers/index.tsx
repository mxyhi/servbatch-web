import React, { useCallback } from "react";
import { ServerEntity } from "../../api/servers";
import { useServers } from "./hooks/useServers";
import ServerFormModal from "./components/ServerFormModal";
import ImportServersModal from "./components/ImportServersModal";
import ServerHeader from "./components/ServerHeader";
import ServerTable from "./components/ServerTable";
import { useModalForm } from "../../hooks/useModalForm";
import useAutoRefresh from "../../hooks/useAutoRefresh";

/**
 * 服务器管理页面
 *
 * 展示服务器列表，提供添加、编辑、删除、测试连接等功能
 */
const Servers: React.FC = () => {
  // 使用自定义Hook管理服务器表单模态框
  const serverForm = useModalForm<ServerEntity>({
    connectionType: "direct",
    port: 22,
  });

  // 使用自定义Hook管理导入模态框
  const importForm = useModalForm<any>();

  // 手动刷新回调
  const handleRefresh = useCallback(() => {
    // 这里可以添加额外的刷新逻辑
  }, []);

  // 使用自定义Hook管理自动刷新状态
  const { autoRefresh, setAutoRefresh, refresh } = useAutoRefresh({
    defaultInterval: 5000,
    onRefresh: handleRefresh,
    refreshOnMount: true,
  });

  // 获取服务器数据和操作
  const {
    servers,
    isLoading,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    testConnectionMutation,
    importServersMutation,
  } = useServers(autoRefresh);

  // 手动刷新处理函数
  const handleManualRefresh = useCallback(() => {
    refetch();
    refresh();
  }, [refetch, refresh]);

  return (
    <div className="space-y-4">
      <ServerHeader
        autoRefresh={autoRefresh}
        isLoading={isLoading}
        onRefreshChange={setAutoRefresh}
        onAddServer={() => serverForm.showModal()}
        onImportServers={importForm.showModal}
        onRefresh={handleManualRefresh}
      />

      <ServerTable
        servers={servers}
        isLoading={isLoading}
        onEdit={serverForm.showModal}
        onDelete={deleteMutation.mutate}
        onTestConnection={testConnectionMutation.mutate}
        testConnectionMutation={testConnectionMutation}
      />

      <ServerFormModal
        isModalVisible={serverForm.visible}
        setIsModalVisible={(visible) => {
          if (!visible) serverForm.hideModal();
        }}
        editingServer={serverForm.editingEntity}
        setEditingServer={() => {}}
        createMutation={createMutation}
        updateMutation={updateMutation}
        form={serverForm.form}
      />

      <ImportServersModal
        isImportModalVisible={importForm.visible}
        setIsImportModalVisible={(visible) => {
          if (!visible) importForm.hideModal();
        }}
        importServersMutation={importServersMutation}
        form={importForm.form}
      />
    </div>
  );
};

export default React.memo(Servers);
