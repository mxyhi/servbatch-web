import api from "./axios";
import {
  LoginDto as LoginDtoType,
  LoginResponse as LoginResponseType,
} from "../types/api"; // Import global types

// Re-export types for use in components
export type LoginDto = LoginDtoType;
export type LoginResponse = LoginResponseType;

export const authApi = {
  // 用户登录
  login: async (loginData: LoginDto): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", loginData);
    // Assuming the actual response matches the local LoginResponse structure
    return response.data;
  },
};
