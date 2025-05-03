import { useState, useCallback } from "react";

interface UseModalResult {
  // 模态框状态
  isVisible: boolean;

  // 控制函数
  showModal: () => void;
  hideModal: () => void;
  toggleModal: () => void;

  // 辅助函数
  withCloseModal: <T extends (...args: any[]) => any>(
    fn: T
  ) => (...args: Parameters<T>) => ReturnType<T>;
}

/**
 * 自定义Hook，用于管理Modal的显示状态
 *
 * 提供模态框的显示状态和控制函数，用于管理模态框的显示和隐藏
 *
 * @param {boolean} initialState 初始显示状态
 * @returns {UseModalResult} Modal状态和控制函数
 */
const useModal = (initialState = false): UseModalResult => {
  const [isVisible, setIsVisible] = useState(initialState);

  // 显示模态框
  const showModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  // 隐藏模态框
  const hideModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  // 切换模态框显示状态
  const toggleModal = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // 包装函数，执行后自动关闭模态框
  const withCloseModal = useCallback(
    <T extends (...args: any[]) => any>(fn: T) => {
      return (...args: Parameters<T>): ReturnType<T> => {
        const result = fn(...args);
        hideModal();
        return result;
      };
    },
    [hideModal]
  );

  return {
    // 模态框状态
    isVisible,

    // 控制函数
    showModal,
    hideModal,
    toggleModal,

    // 辅助函数
    withCloseModal,
  };
};

export default useModal;
