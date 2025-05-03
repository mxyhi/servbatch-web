import { useState, useCallback, useEffect, useRef } from "react";
import { Form, FormInstance } from "antd";
import { message } from "../utils/message";

/**
 * 模态框表单配置选项
 */
export interface UseModalFormOptions<T> {
  /** 表单初始值 */
  initialValues?: Record<string, any>;

  /** 外部表单实例（可选，如果不提供则创建新的） */
  form?: FormInstance;

  /** 关闭模态框时是否重置表单 */
  resetOnClose?: boolean;

  /** 提交成功后是否关闭模态框 */
  closeOnSuccess?: boolean;

  /** 提交成功回调 */
  onSuccess?: (values: any, entity: T | null) => void | Promise<void>;

  /** 提交失败回调 */
  onError?: (error: any) => void;

  /** 模态框关闭回调 */
  onClose?: () => void;

  /** 自定义表单验证函数 */
  validate?: (values: any) => boolean | string | Promise<boolean | string>;
}

/**
 * 模态框表单返回值
 */
export interface UseModalFormResult<T> {
  /** 模态框可见状态 */
  visible: boolean;

  /** 当前编辑的实体 */
  editingEntity: T | null;

  /** 表单实例 */
  form: FormInstance;

  /** 是否处于编辑模式 */
  isEditMode: boolean;

  /** 是否正在提交 */
  isSubmitting: boolean;

  /** 显示模态框 */
  showModal: (entity?: T) => void;

  /** 隐藏模态框 */
  hideModal: () => void;

  /** 重置表单 */
  resetForm: () => void;

  /** 提交表单 */
  submitForm: () => Promise<void>;

  /** 设置编辑实体 */
  setEditingEntity: (entity: T | null) => void;
}

/**
 * 模态框表单管理Hook
 *
 * 用于管理带表单的模态框状态，包括显示/隐藏、编辑实体、表单提交等
 *
 * @example
 * const {
 *   visible,
 *   form,
 *   isEditMode,
 *   showModal,
 *   hideModal,
 *   submitForm,
 * } = useModalForm({
 *   initialValues: { status: 'active' },
 *   onSuccess: (values, entity) => {
 *     if (entity) {
 *       updateUser(entity.id, values);
 *     } else {
 *       createUser(values);
 *     }
 *   }
 * });
 */
export function useModalForm<
  T extends Record<string, any> = Record<string, any>
>({
  initialValues,
  form: externalForm,
  resetOnClose = true,
  closeOnSuccess = true,
  onSuccess,
  onError,
  onClose,
  validate,
}: UseModalFormOptions<T> = {}): UseModalFormResult<T> {
  // 模态框状态
  const [visible, setVisible] = useState(false);
  const [editingEntity, setEditingEntity] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 使用 useRef 跟踪模态框之前的可见状态
  const prevVisibleRef = useRef<boolean | undefined>(undefined);

  // 使用外部表单实例或创建新的
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  // 更新之前的可见状态
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);

  // 注意：我们现在使用 Form.Provider 来解决 useForm 警告问题
  // 这个 Provider 在 App.tsx 中被添加，包装了整个应用

  // 是否处于编辑模式
  const isEditMode = !!editingEntity;

  // 显示模态框
  const showModal = useCallback(
    (entity?: T) => {
      // 设置编辑实体
      setEditingEntity(entity || null);

      // 重置表单
      form.resetFields();

      // 设置表单值
      if (entity) {
        form.setFieldsValue(entity);
      } else if (initialValues) {
        form.setFieldsValue(initialValues);
      }

      // 显示模态框
      setVisible(true);
    },
    [form, initialValues]
  );

  // 隐藏模态框
  const hideModal = useCallback(() => {
    setVisible(false);

    // 调用关闭回调
    if (onClose) {
      onClose();
    }

    // 如果设置了resetOnClose，则重置表单和编辑实体
    if (resetOnClose) {
      setTimeout(() => {
        form.resetFields();
        setEditingEntity(null);
      }, 100);
    }
  }, [form, onClose, resetOnClose]);

  // 重置表单
  const resetForm = useCallback(() => {
    form.resetFields();

    // 如果有初始值，设置初始值
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }

    // 如果有编辑实体，设置编辑实体的值
    if (editingEntity) {
      form.setFieldsValue(editingEntity);
    }
  }, [form, initialValues, editingEntity]);

  // 提交表单
  const submitForm = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // 验证表单
      const values = await form.validateFields();

      // 如果有自定义验证函数，则执行
      if (validate) {
        const result = await validate(values);
        if (result !== true) {
          if (typeof result === "string") {
            message.error(result);
          }
          return;
        }
      }

      // 调用成功回调
      if (onSuccess) {
        await onSuccess(values, editingEntity);
      }

      // 如果设置了closeOnSuccess，则关闭模态框
      if (closeOnSuccess) {
        hideModal();
      }
    } catch (error) {
      // 调用错误回调
      if (onError) {
        onError(error);
      } else {
        console.error("表单提交错误:", error);
        message.error("表单验证失败，请检查输入");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form,
    validate,
    onSuccess,
    editingEntity,
    closeOnSuccess,
    hideModal,
    onError,
  ]);

  // 当编辑实体变化时，更新表单值
  useEffect(() => {
    if (editingEntity && visible) {
      form.setFieldsValue(editingEntity);
    }
  }, [editingEntity, form, visible]);

  return {
    visible,
    editingEntity,
    form,
    isEditMode,
    isSubmitting,
    showModal,
    hideModal,
    resetForm,
    submitForm,
    setEditingEntity,
  };
}
