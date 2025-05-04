import React from "react";
import { Modal } from "antd";
import { CleanupByDateDto, CleanupByStatusDto } from "../../types/api";

// 导入自定义Hook
import { useExecutions } from "./hooks/useExecutions";
import { useExecutionFilters } from "./hooks/useExecutionFilters";
import { useExecutionModals } from "./hooks/useExecutionModals";

// 导入组件
import ExecutionTable from "./components/ExecutionTable";
import ExecutionFilters from "./components/ExecutionFilters";
import ExecutionDetailModal from "./components/ExecutionDetailModal";
import CleanupByDateModal from "./components/CleanupByDateModal";
import CleanupByStatusModal from "./components/CleanupByStatusModal";

/**
 * 执行记录页面组件
 */
const Executions: React.FC = () => {
  // 使用自定义Hook
  const {
    filterTaskId,
    filterServerId,
    tasks,
    servers,
    handleTaskFilterChange,
    handleServerFilterChange,
    resetFilters,
  } = useExecutionFilters();

  const {
    executions,
    isLoading,
    handleDelete,
    handleCancel,
    handleCleanupByDate,
    handleCleanupByStatus,
    handleCleanupByTaskId,
    handleCleanupByServerId,
    cleanupByDateMutation,
    cleanupByStatusMutation,
    pagination,
    handleTableChange,
  } = useExecutions({ taskId: filterTaskId, serverId: filterServerId });

  const {
    detailModalVisible,
    cleanupByDateModalVisible,
    cleanupByStatusModalVisible,
    selectedExecution,
    dateForm,
    statusForm,
    showDetailModal,
    handleDetailModalClose,
    showCleanupByDateModal,
    handleCleanupByDateModalClose,
    showCleanupByStatusModal,
    handleCleanupByStatusModalClose,
  } = useExecutionModals();

  // 获取任务名称
  const getTaskName = (taskId: number) => {
    const task = tasks?.find((t) => t.id === taskId);
    return task ? task.name : `任务 #${taskId}`;
  };

  // 获取服务器名称
  const getServerName = (serverId: number) => {
    const server = servers?.find((s) => s.id === serverId);
    return server ? server.name : `服务器 #${serverId}`;
  };

  // 处理按任务ID清理
  const handleConfirmCleanupByTaskId = (taskId: number) => {
    Modal.confirm({
      title: "确认清理",
      content: `确定要清理任务 "${getTaskName(
        taskId
      )}" 的所有执行记录吗？此操作不可恢复。`,
      onOk: () => {
        handleCleanupByTaskId(taskId);
      },
      okText: "确定",
      cancelText: "取消",
    });
  };

  // 处理按服务器ID清理
  const handleConfirmCleanupByServerId = (serverId: number) => {
    Modal.confirm({
      title: "确认清理",
      content: `确定要清理服务器 "${getServerName(
        serverId
      )}" 的所有执行记录吗？此操作不可恢复。`,
      onOk: () => {
        handleCleanupByServerId(serverId);
      },
      okText: "确定",
      cancelText: "取消",
    });
  };

  // 处理按日期清理提交
  const handleCleanupByDateSubmit = (data: CleanupByDateDto) => {
    handleCleanupByDate(data);
  };

  // 处理按状态清理提交
  const handleCleanupByStatusSubmit = (data: CleanupByStatusDto) => {
    handleCleanupByStatus(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">执行记录</h1>
        <ExecutionFilters
          tasks={tasks}
          servers={servers}
          filterTaskId={filterTaskId}
          filterServerId={filterServerId}
          onTaskFilterChange={handleTaskFilterChange}
          onServerFilterChange={handleServerFilterChange}
          onResetFilters={resetFilters}
          onShowCleanupByDateModal={showCleanupByDateModal}
          onShowCleanupByStatusModal={showCleanupByStatusModal}
          onCleanupByTaskId={handleConfirmCleanupByTaskId}
          onCleanupByServerId={handleConfirmCleanupByServerId}
        />
      </div>

      <ExecutionTable
        executions={executions?.items}
        isLoading={isLoading}
        onViewDetail={showDetailModal}
        onCancel={handleCancel}
        onDelete={handleDelete}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <ExecutionDetailModal
        visible={detailModalVisible}
        execution={selectedExecution}
        onClose={handleDetailModalClose}
      />

      <CleanupByDateModal
        visible={cleanupByDateModalVisible}
        form={dateForm}
        onClose={handleCleanupByDateModalClose}
        onCleanup={handleCleanupByDateSubmit}
        isLoading={cleanupByDateMutation.isPending}
      />

      <CleanupByStatusModal
        visible={cleanupByStatusModalVisible}
        form={statusForm}
        onClose={handleCleanupByStatusModalClose}
        onCleanup={handleCleanupByStatusSubmit}
        isLoading={cleanupByStatusMutation.isPending}
      />
    </div>
  );
};

export default Executions;
