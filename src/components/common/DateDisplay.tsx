import React from "react";

interface DateDisplayProps {
  date: string | Date | undefined;
  defaultText?: string;
  format?: (date: Date) => string;
}

/**
 * 日期显示组件
 * @param date 日期对象或日期字符串
 * @param defaultText 当日期为空时显示的文本
 * @param format 自定义日期格式化函数
 */
const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  defaultText = "未知",
  format = (date: Date) => date.toLocaleString(),
}) => {
  if (!date) return <span>{defaultText}</span>;

  return <span>{format(new Date(date))}</span>;
};

export default React.memo(DateDisplay);
