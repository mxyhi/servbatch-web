import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CreateTaskDto, UpdateTaskDto } from "../../api/tasks";
import { ID } from "../../types/common";

// 导入自定义Hook
import { useTasks } from "./hooks/useTasks";
import { useTaskForm } from "./hooks/useTaskForm";
import { useTaskExecution } from "./hooks/useTaskExecution";

// 导入组件
import TaskTable from "./components/TaskTable";
import TaskFormModal from "./components/TaskFormModal";
import ExecuteTaskModal from "./components/ExecuteTaskModal";

/**
 * 任务管理页面组件
 */
const Tasks: React.FC = () => {
  // 使用自定义Hook
  const {
    tasks,
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    pagination,
    handleTableChange,
  } = useTasks();

  const { form, isModalVisible, editingTask, showModal, handleCancel } =
    useTaskForm();

  const {
    executeForm,
    isExecuteModalVisible,

    servers,
    checkAll,
    indeterminate,
    showExecuteModal,
    handleExecuteCancel,
    handleExecute,
    handleViewHistory,
    onCheckAllChange,
    onServerSelectChange,
    executeMutation,
  } = useTaskExecution();

  // 处理表单提交
  const handleSubmit = (values: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      return handleUpdate(editingTask.id as ID, values as UpdateTaskDto);
    } else {
      return handleCreate(values as CreateTaskDto);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">任务管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          添加任务
        </Button>
      </div>

      <TaskTable
        tasks={tasks}
        isLoading={isLoading}
        onEdit={showModal}
        onDelete={handleDelete}
        onExecute={showExecuteModal}
        onViewHistory={handleViewHistory}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <TaskFormModal
        visible={isModalVisible}
        form={form}
        editingTask={editingTask}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      <ExecuteTaskModal
        visible={isExecuteModalVisible}
        form={executeForm}
        servers={servers}
        checkAll={checkAll}
        indeterminate={indeterminate}
        onCancel={handleExecuteCancel}
        onExecute={handleExecute}
        onCheckAllChange={onCheckAllChange}
        onServerSelectChange={onServerSelectChange}
        isLoading={executeMutation.isPending}
      />
    </div>
  );
};

export default Tasks;
