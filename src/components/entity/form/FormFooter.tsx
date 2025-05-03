import React from "react";
import { Form, Button, Space } from "antd";

interface FormFooterProps {
  showSubmitButton: boolean;
  showResetButton: boolean;
  showCancelButton: boolean;
  submitText: string;
  resetText: string;
  cancelText: string;
  submitLoading: boolean;
  onReset: () => void;
  onCancel: () => void;
}

/**
 * 表单底部组件
 * 
 * 处理表单底部按钮的渲染
 */
const FormFooter: React.FC<FormFooterProps> = ({
  showSubmitButton,
  showResetButton,
  showCancelButton,
  submitText,
  resetText,
  cancelText,
  submitLoading,
  onReset,
  onCancel,
}) => {
  if (!showSubmitButton && !showResetButton && !showCancelButton) {
    return null;
  }

  return (
    <Form.Item className="mb-0 mt-4">
      <Space>
        {showSubmitButton && (
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            {submitText}
          </Button>
        )}
        {showResetButton && <Button onClick={onReset}>{resetText}</Button>}
        {showCancelButton && <Button onClick={onCancel}>{cancelText}</Button>}
      </Space>
    </Form.Item>
  );
};

export default React.memo(FormFooter);
