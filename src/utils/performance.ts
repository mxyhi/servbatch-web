/**
 * React性能优化工具
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * 防抖函数
 * 
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * 节流函数
 * 
 * @param fn 要节流的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 防抖Hook
 * 
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param deps 依赖项数组
 * @returns 防抖后的函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  return useCallback(debounce(fn, delay), deps);
}

/**
 * 节流Hook
 * 
 * @param fn 要节流的函数
 * @param limit 时间限制（毫秒）
 * @param deps 依赖项数组
 * @returns 节流后的函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  return useCallback(throttle(fn, limit), deps);
}

/**
 * 防抖值Hook
 * 
 * @param value 要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * 异步备忘Hook
 * 
 * @param factory 工厂函数
 * @param deps 依赖项数组
 * @returns [值, 加载状态, 错误]
 */
export function useAsyncMemo<T>(
  factory: () => Promise<T>,
  deps: React.DependencyList,
  initial: T
): [T, boolean, Error | null] {
  const [value, setValue] = useState<T>(initial);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    factory()
      .then((result) => {
        if (isMounted) {
          setValue(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, deps);
  
  return [value, loading, error];
}

/**
 * 上一个值Hook
 * 
 * @param value 当前值
 * @returns 上一个值
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * 深度比较备忘Hook
 * 
 * @param value 要备忘的值
 * @param deps 依赖项数组
 * @returns 备忘的值
 */
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>({
    deps: [],
    value: {} as T,
  });
  
  // 简单的深度比较
  const depsChanged = !deps.every((dep, i) => {
    return JSON.stringify(dep) === JSON.stringify(ref.current.deps[i]);
  });
  
  if (depsChanged || ref.current.deps.length !== deps.length) {
    ref.current.deps = deps;
    ref.current.value = factory();
  }
  
  return ref.current.value;
}

/**
 * 虚拟化列表Hook
 * 
 * @param items 列表项
 * @param itemHeight 项高度
 * @param visibleItems 可见项数
 * @returns [可见项, 滚动到索引的函数]
 */
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  visibleItems: number
): [T[], (index: number) => void] {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const visibleData = useMemo(() => {
    return items.slice(startIndex, startIndex + visibleItems);
  }, [items, startIndex, visibleItems]);
  
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
    setStartIndex(Math.max(0, index));
  }, [itemHeight]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.floor(scrollTop / itemHeight);
        setStartIndex(index);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [itemHeight]);
  
  return [visibleData, scrollToIndex];
}
