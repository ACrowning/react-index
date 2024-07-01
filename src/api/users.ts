import { apiInstance } from "./index";

const authRoot = "auth";

interface User {
  username: string;
  password: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: {
    username: string;
    email: string;
    role: string;
    id: string;
  };
  token: string;
}

export const users = {
  registerUser: async (user: User): Promise<AuthResponse> => {
    const response = await apiInstance.post(`/${authRoot}/signup`, user);
    return response.data;
  },

  loginUser: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiInstance.post(`/${authRoot}/login`, {
      email,
      password,
    });
    return response.data;
  },
};
