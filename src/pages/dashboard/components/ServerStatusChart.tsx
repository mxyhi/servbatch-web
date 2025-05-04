import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ServerStatusInfo } from "../../../types/api";

interface ServerStatusChartProps {
  serverStatus: ServerStatusInfo[] | undefined;
}

/**
 * 服务器状态图表组件
 */
const ServerStatusChart: React.FC<ServerStatusChartProps> = ({
  serverStatus,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serverStatus && chartRef.current) {
      const chart = echarts.init(chartRef.current);

      // 统计在线和离线服务器数量
      const onlineCount = serverStatus.filter(
        (s) => s.status === "online"
      ).length;
      const offlineCount = serverStatus.length - onlineCount;

      const option = {
        title: {
          text: "服务器状态",
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
            name: "服务器状态",
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
              { value: onlineCount, name: "在线" },
              { value: offlineCount, name: "离线" },
            ],
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [serverStatus]);

  return <div ref={chartRef} className="w-full h-[300px]" />;
};

export default ServerStatusChart;
