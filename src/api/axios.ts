import axios from "axios";
import { clearAuth, getToken } from "../utils/auth";

const baseURL = "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器，添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理认证错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 如果是401错误，处理登出逻辑
    if (error.response && error.response.status === 401) {
      console.error("认证失败，请重新登录");
      // 清除认证信息
      clearAuth();
      // 重定向到登录页面
      window.location.href = "/#/login";
    }
    return Promise.reject(error);
  }
);

export default api;
