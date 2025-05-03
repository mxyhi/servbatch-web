import { useState, useCallback, useEffect, useRef } from "react";
import { Form, FormInstance } from "antd";
import { message } from "../utils/message";

/**
 * 实体到表单值的转换函数类型
 */
export type EntityToFormValues<T, V> = (entity: T) => V;

/**
 * 表单值到实体的转换函数类型
 */
export type FormValuesToEntity<T, V> = (values: V) => Partial<T>;

/**
 * 模态框表单配置选项
 */
export interface UseModalFormOptions<
  T extends Record<string, any>,
  V extends Record<string, any>
> {
  /** 表单初始值 */
  initialValues?: Partial<V>;

  /** 外部表单实例（可选，如果不提供则创建新的） */
  form?: FormInstance<V>;

  /** 关闭模态框时是否重置表单 */
  resetOnClose?: boolean;

  /** 提交成功后是否关闭模态框 */
  closeOnSuccess?: boolean;

  /** 提交成功回调 */
  onSuccess?: (values: V, entity: T | null) => void | Promise<void>;

  /** 提交失败回调 */
  onError?: (error: unknown) => void;

  /** 模态框关闭回调 */
  onClose?: () => void;

  /** 自定义表单验证函数 */
  validate?: (values: V) => boolean | string | Promise<boolean | string>;

  /** 实体到表单值的转换函数 */
  entityToFormValues?: EntityToFormValues<T, V>;

  /** 表单值到实体的转换函数 */
  formValuesToEntity?: FormValuesToEntity<T, V>;
}

/**
 * 模态框表单返回值
 */
export interface UseModalFormResult<
  T extends Record<string, any>,
  V extends Record<string, any>
> {
  /** 模态框可见状态 */
  visible: boolean;

  /** 当前编辑的实体 */
  editingEntity: T | null;

  /** 表单实例 */
  form: FormInstance<V>;

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
 * } = useModalForm<UserEntity, UserFormValues>({
 *   initialValues: { status: 'active' },
 *   onSuccess: (values, entity) => {
 *     if (entity) {
 *       updateUser(entity.id, values);
 *     } else {
 *       createUser(values);
 *     }
 *   },
 *   // 可选：自定义实体到表单值的转换
 *   entityToFormValues: (entity) => ({
 *     name: entity.name,
 *     email: entity.email,
 *     status: entity.status
 *   })
 * });
 */
export function useModalForm<
  T extends Record<string, any>,
  V extends Record<string, any> = T
>({
  initialValues,
  form: externalForm,
  resetOnClose = true,
  closeOnSuccess = true,
  onSuccess,
  onError,
  onClose,
  validate,
  entityToFormValues,
  formValuesToEntity, // 保留参数以便未来扩展
  ...rest // 添加 rest 参数以支持额外的初始值
}: UseModalFormOptions<T, V> & Record<string, any> = {}): UseModalFormResult<
  T,
  V
> {
  // 忽略额外的参数，这些可能是传递给表单的初始值
  // 例如 useModalForm<ServerEntity>({ connectionType: "direct", port: 22 })
  // 这里的 connectionType 和 port 会被当作初始值的一部分

  // 合并额外的初始值
  const mergedInitialValues = initialValues
    ? { ...rest, ...initialValues }
    : Object.keys(rest).length > 0
    ? rest
    : undefined;

  // 模态框状态
  const [visible, setVisible] = useState(false);
  const [editingEntity, setEditingEntity] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 使用 useRef 跟踪模态框之前的可见状态
  const prevVisibleRef = useRef<boolean | undefined>(undefined);

  // 使用外部表单实例或创建新的
  const [internalForm] = Form.useForm<V>();
  const form = externalForm || internalForm;

  // 更新之前的可见状态
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);

  // 注意：我们现在使用 Form.Provider 来解决 useForm 警告问题
  // 这个 Provider 在 App.tsx 中被添加，包装了整个应用

  // 是否处于编辑模式
  const isEditMode = !!editingEntity;

  // 将实体转换为表单值
  const convertEntityToFormValues = useCallback(
    (entity: T): V => {
      if (entityToFormValues) {
        return entityToFormValues(entity);
      }
      // 默认转换：直接使用实体作为表单值（假设结构兼容）
      return entity as unknown as V;
    },
    [entityToFormValues]
  );

  // 将表单值转换为实体（用于创建新实体）
  const convertFormValuesToEntity = useCallback(
    (values: V): Partial<T> => {
      if (formValuesToEntity) {
        return formValuesToEntity(values);
      }
      // 默认转换：直接使用表单值作为实体（假设结构兼容）
      return values as unknown as Partial<T>;
    },
    [formValuesToEntity]
  );

  // 显示模态框
  const showModal = useCallback(
    (entity?: T) => {
      // 设置编辑实体
      setEditingEntity(entity || null);

      // 重置表单
      form.resetFields();

      // 设置表单值
      if (entity) {
        const formValues = convertEntityToFormValues(entity);
        form.setFieldsValue(formValues);
      } else if (mergedInitialValues) {
        form.setFieldsValue(mergedInitialValues as Partial<V>);
      }

      // 显示模态框
      setVisible(true);
    },
    [form, mergedInitialValues, convertEntityToFormValues]
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
    if (mergedInitialValues) {
      form.setFieldsValue(mergedInitialValues as Partial<V>);
    }

    // 如果有编辑实体，设置编辑实体的值
    if (editingEntity) {
      const formValues = convertEntityToFormValues(editingEntity);
      form.setFieldsValue(formValues);
    }
  }, [form, mergedInitialValues, editingEntity, convertEntityToFormValues]);

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

      // 转换表单值为实体（仅用于日志和调试，实际转换由调用者处理）
      // 这里不使用转换结果，但保留转换逻辑以便未来扩展
      convertFormValuesToEntity(values);

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
    convertFormValuesToEntity,
  ]);

  // 当编辑实体变化时，更新表单值
  useEffect(() => {
    if (editingEntity && visible) {
      const formValues = convertEntityToFormValues(editingEntity);
      form.setFieldsValue(formValues);
    }
  }, [editingEntity, form, visible, convertEntityToFormValues]);

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
