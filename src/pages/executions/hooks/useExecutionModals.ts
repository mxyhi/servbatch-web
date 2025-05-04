import { useState } from "react";
import { Form } from "antd";
import { TaskExecutionEntity } from "../../../types/api";

/**
 * 处理执行记录相关模态框的自定义Hook
 */
export const useExecutionModals = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [cleanupByDateModalVisible, setCleanupByDateModalVisible] =
    useState(false);
  const [cleanupByStatusModalVisible, setCleanupByStatusModalVisible] =
    useState(false);
  const [selectedExecution, setSelectedExecution] =
    useState<TaskExecutionEntity | null>(null);
  const [dateForm] = Form.useForm();
  const [statusForm] = Form.useForm();

  // 显示详情模态框
  const showDetailModal = (execution: TaskExecutionEntity) => {
    setSelectedExecution(execution);
    setDetailModalVisible(true);
  };

  // 关闭详情模态框
  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedExecution(null);
  };

  // 显示按日期清理模态框
  const showCleanupByDateModal = () => {
    setCleanupByDateModalVisible(true);
  };

  // 关闭按日期清理模态框
  const handleCleanupByDateModalClose = () => {
    setCleanupByDateModalVisible(false);
    dateForm.resetFields();
  };

  // 显示按状态清理模态框
  const showCleanupByStatusModal = () => {
    setCleanupByStatusModalVisible(true);
  };

  // 关闭按状态清理模态框
  const handleCleanupByStatusModalClose = () => {
    setCleanupByStatusModalVisible(false);
    statusForm.resetFields();
  };

  return {
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
  };
};
