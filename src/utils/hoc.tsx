/**
 * 高阶组件工具
 */
import React, { ComponentType, useEffect, useState } from "react";

/**
 * 带加载状态的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param LoadingComponent 加载组件
 * @returns 带加载状态的组件
 */
export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  LoadingComponent: ComponentType = () => <div>Loading...</div>
): ComponentType<P & { loading?: boolean }> {
  return function WithLoading(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    
    return loading ? <LoadingComponent /> : <WrappedComponent {...(rest as P)} />;
  };
}

/**
 * 带错误处理的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param ErrorComponent 错误组件
 * @returns 带错误处理的组件
 */
export function withErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>,
  ErrorComponent: ComponentType<{ error: Error }> = ({ error }) => (
    <div>Error: {error.message}</div>
  )
): ComponentType<P & { error?: Error | null }> {
  return function WithErrorHandling(props: P & { error?: Error | null }) {
    const { error, ...rest } = props;
    
    return error ? <ErrorComponent error={error} /> : <WrappedComponent {...(rest as P)} />;
  };
}

/**
 * 带认证的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param UnauthorizedComponent 未授权组件
 * @returns 带认证的组件
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  UnauthorizedComponent: ComponentType = () => <div>Unauthorized</div>,
  isAuthenticated: () => boolean
): ComponentType<P> {
  return function WithAuth(props: P) {
    const [authorized, setAuthorized] = useState(false);
    
    useEffect(() => {
      setAuthorized(isAuthenticated());
    }, []);
    
    return authorized ? <WrappedComponent {...props} /> : <UnauthorizedComponent />;
  };
}

/**
 * 带主题的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param theme 主题对象
 * @returns 带主题的组件
 */
export function withTheme<P extends object, T extends object>(
  WrappedComponent: ComponentType<P & { theme: T }>,
  theme: T
): ComponentType<P> {
  return function WithTheme(props: P) {
    return <WrappedComponent {...props} theme={theme} />;
  };
}

/**
 * 带样式的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param styles 样式对象
 * @returns 带样式的组件
 */
export function withStyles<P extends object, S extends object>(
  WrappedComponent: ComponentType<P & { styles: S }>,
  styles: S
): ComponentType<P> {
  return function WithStyles(props: P) {
    return <WrappedComponent {...props} styles={styles} />;
  };
}

/**
 * 带日志的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param componentName 组件名称
 * @returns 带日志的组件
 */
export function withLogger<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string = WrappedComponent.displayName || WrappedComponent.name || "Component"
): ComponentType<P> {
  function WithLogger(props: P) {
    useEffect(() => {
      console.log(`${componentName} mounted`, props);
      
      return () => {
        console.log(`${componentName} unmounted`);
      };
    }, [props]);
    
    useEffect(() => {
      console.log(`${componentName} updated`, props);
    });
    
    return <WrappedComponent {...props} />;
  }
  
  WithLogger.displayName = `WithLogger(${componentName})`;
  
  return WithLogger;
}

/**
 * 带性能监控的高阶组件
 * 
 * @param WrappedComponent 被包装的组件
 * @param componentName 组件名称
 * @returns 带性能监控的组件
 */
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string = WrappedComponent.displayName || WrappedComponent.name || "Component"
): ComponentType<P> {
  function WithPerformanceMonitoring(props: P) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`${componentName} render time: ${endTime - startTime}ms`);
      };
    });
    
    return <WrappedComponent {...props} />;
  }
  
  WithPerformanceMonitoring.displayName = `WithPerformanceMonitoring(${componentName})`;
  
  return WithPerformanceMonitoring;
}
