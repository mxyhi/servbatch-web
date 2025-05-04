import { useEffect, RefObject } from "react";
import * as echarts from "echarts";

/**
 * 处理图表大小调整的自定义Hook
 * @param chartRefs 图表DOM引用数组
 */
export const useChartResize = (
  chartRefs: RefObject<HTMLDivElement | null>[]
) => {
  useEffect(() => {
    const handleResize = () => {
      chartRefs.forEach((ref) => {
        if (ref.current) {
          const chart = echarts.getInstanceByDom(ref.current);
          if (chart) {
            chart.resize();
          }
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartRefs]);
};
