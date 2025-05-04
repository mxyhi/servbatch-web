import { LoginResponse } from "../types/api";

// 本地存储键
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// 保存认证信息到本地存储
export const saveAuth = (data: LoginResponse) => {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

// 从本地存储获取令牌
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 从本地存储获取用户信息
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// 清除认证信息
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
