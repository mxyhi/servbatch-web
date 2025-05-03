import { useState, useCallback } from "react";
import { Form, FormInstance } from "antd";

interface UseEntityFormResult<T> {
  // 表单实例
  form: FormInstance;

  // 编辑状态
  editingEntity: T | null;
  setEditingEntity: (entity: T | null) => void;
  isEditing: boolean;

  // 表单操作
  resetForm: () => void;
  initFormWithEntity: (entity: T) => void;
  setFormValues: (values: Partial<T>) => void;

  // 表单状态
  getIsNew: () => boolean;
  getIsEdit: () => boolean;
}

/**
 * 自定义Hook，用于管理实体表单的状态和操作
 *
 * 提供表单实例和相关操作函数，用于管理实体的创建和编辑
 *
 * @template T 实体类型
 * @param {Partial<T>} defaultValues 表单默认值
 * @returns {UseEntityFormResult<T>} 表单实例和相关操作函数
 */
const useEntityForm = <T extends Record<string, any>>(
  defaultValues?: Partial<T>
): UseEntityFormResult<T> => {
  const [form] = Form.useForm();
  const [editingEntity, setEditingEntity] = useState<T | null>(null);

  // 重置表单
  const resetForm = useCallback(() => {
    form.resetFields();
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
    setEditingEntity(null);
  }, [form, defaultValues]);

  // 使用实体初始化表单
  const initFormWithEntity = useCallback(
    (entity: T) => {
      setEditingEntity(entity);
      form.setFieldsValue(entity);
    },
    [form]
  );

  // 设置表单值
  const setFormValues = useCallback(
    (values: Partial<T>) => {
      form.setFieldsValue(values);
    },
    [form]
  );

  // 判断是否为新建
  const getIsNew = useCallback(() => {
    return editingEntity === null;
  }, [editingEntity]);

  // 判断是否为编辑
  const getIsEdit = useCallback(() => {
    return editingEntity !== null;
  }, [editingEntity]);

  // 初始化默认值
  useState(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  });

  return {
    // 表单实例
    form,

    // 编辑状态
    editingEntity,
    setEditingEntity,
    isEditing: editingEntity !== null,

    // 表单操作
    resetForm,
    initFormWithEntity,
    setFormValues,

    // 表单状态
    getIsNew,
    getIsEdit,
  };
};

export default useEntityForm;
