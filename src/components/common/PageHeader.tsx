import React, { ReactNode } from "react";
import { Space, Typography } from "antd";

interface PageHeaderProps {
  // 基本属性
  title: string;

  // 额外内容
  extra?: ReactNode;

  // 样式相关
  className?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5;

  // 子标题
  subtitle?: string;

  // 左侧内容
  leftContent?: ReactNode;
}

/**
 * 页面标题组件
 *
 * 用于页面顶部的标题栏，支持左侧标题和右侧操作按钮
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  extra,
  className = "",
  titleLevel = 2,
  subtitle,
  leftContent,
}) => {
  return (
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <div className="flex items-center">
        {leftContent && <div className="mr-3">{leftContent}</div>}
        <div>
          <Typography.Title level={titleLevel} className="m-0">
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary" className="mt-1 block">
              {subtitle}
            </Typography.Text>
          )}
        </div>
      </div>
      {extra && <Space>{extra}</Space>}
    </div>
  );
};

export default React.memo(PageHeader);
