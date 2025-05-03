/**
 * 表单相关类型定义
 */
import { ReactNode } from 'react';
import { FormInstance, Rule } from 'antd/es/form';
import { FormLayout } from './common';

// 表单项配置
export interface FormItem {
  // 表单项名称
  name: string;
  
  // 表单项标签
  label?: ReactNode;
  
  // 表单项组件
  component: ReactNode;
  
  // 表单项规则
  rules?: Rule[];
  
  // 表单项提示
  tooltip?: ReactNode;
  
  // 表单项额外信息
  extra?: ReactNode;
  
  // 表单项是否禁用
  disabled?: boolean;
  
  // 表单项是否隐藏
  hidden?: boolean;
  
  // 表单项依赖字段
  dependencies?: string[];
  
  // 表单项是否只在编辑模式显示
  editOnly?: boolean;
  
  // 表单项是否只在创建模式显示
  createOnly?: boolean;
  
  // 表单项栅格配置
  colSpan?: number;
  
  // 表单项自定义渲染函数
  render?: (
    item: FormItem,
    form: FormInstance,
    isEditMode: boolean
  ) => ReactNode;
}

// 表单提交回调
export type FormSubmitCallback<T = Record<string, unknown>> = 
  (values: T) => void | Promise<void>;

// 表单值变化回调
export type FormValuesChangeCallback<T = Record<string, unknown>> = 
  (changedValues: Partial<T>, allValues: T) => void;

// 表单字段变化回调
export type FormFieldsChangeCallback = 
  (changedFields: unknown[], allFields: unknown[]) => void;
