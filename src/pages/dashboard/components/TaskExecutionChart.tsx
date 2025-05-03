import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface TaskExecutionChartProps {
  successfulExecutions: number;
  failedExecutions: number;
}

/**
 * 任务执行统计图表组件
 */
const TaskExecutionChart: React.FC<TaskExecutionChartProps> = ({
  successfulExecutions,
  failedExecutions,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: "任务执行统计",
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "bottom",
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12,
          },
        },
        color: ["#52c41a", "#ff4d4f"],
        series: [
          {
            name: "执行结果",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: successfulExecutions, name: "成功" },
              { value: failedExecutions, name: "失败" },
            ],
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [successfulExecutions, failedExecutions]);

  return <div ref={chartRef} className="w-full h-[300px]" />;
};

export default TaskExecutionChart;
