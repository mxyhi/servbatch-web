import React from "react";
import { Form, FormInstance } from "antd";
import { FormItem as FormItemType } from "../../../types/form";

interface FormItemProps {
  item: FormItemType;
  form: FormInstance;
  isEditMode: boolean;
}

/**
 * 表单项组件
 *
 * 处理单个表单项的渲染，支持自定义渲染函数
 */
const FormItem: React.FC<FormItemProps> = ({ item, form, isEditMode }) => {
  // 如果有自定义渲染函数，使用自定义渲染
  if (item.render) {
    return <>{item.render(item, form, isEditMode)}</>;
  }

  // 默认渲染
  // 计算hidden属性值
  const isHidden =
    typeof item.hidden === "function"
      ? item.hidden(form, isEditMode)
      : item.hidden;

  return (
    <div className={`col-span-${item.colSpan || 1}`}>
      <Form.Item
        name={item.name}
        label={item.label}
        rules={item.rules}
        tooltip={item.tooltip}
        extra={item.extra}
        dependencies={item.dependencies}
        hidden={isHidden}
      >
        {item.component}
      </Form.Item>
    </div>
  );
};

export default React.memo(FormItem);
