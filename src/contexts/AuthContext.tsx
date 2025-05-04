import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { message } from "../utils/message";
import { authApi } from "../api/auth";
import { LoginDto } from "../types/api/auth";
import { clearAuth, getUser, isAuthenticated, saveAuth } from "../utils/auth";

// 用户类型
export interface User {
  id: number;
  username: string;
  email?: string | null;
  role: "admin" | "user";
  isActive: boolean;
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (data: LoginDto) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证上下文提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 初始化时从本地存储加载用户信息
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // 登录方法
  const login = async (loginData: LoginDto): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authApi.login(loginData);
      saveAuth(response);
      setUser(response.user);
      message.success("登录成功");
      return true;
    } catch (error) {
      console.error("登录失败:", error);
      message.error("登录失败: 用户名或密码错误");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 登出方法
  const logout = () => {
    clearAuth();
    setUser(null);
    message.success("已退出登录");
    navigate("/login");
  };

  // 提供上下文值
  const value = {
    user,
    isLoggedIn: isAuthenticated(),
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义Hook，用于在组件中使用认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
