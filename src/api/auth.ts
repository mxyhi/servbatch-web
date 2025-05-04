import api from "./axios";
import { LoginDto, LoginResponse } from "../types/api"; // Import global types

export const authApi = {
  // 用户登录
  login: async (loginData: LoginDto): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", loginData);
    // Assuming the actual response matches the local LoginResponse structure
    return response.data;
  },
};
