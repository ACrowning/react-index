import { apiInstance } from "./index";
import { localStorageService } from "./localStorageService";

const authRoot = "auth";

export enum Role {
  GUEST = "GUEST",
  ADMIN = "ADMIN",
}

export interface UserRegisterPayload {
  username: string;
  password: string;
  email: string;
  role: Role;
}

export const users = {
  registerUser: async (user: UserRegisterPayload) => {
    const response = await apiInstance.post(`/${authRoot}/signup`, user);
    return response.data;
  },

  loginUser: async (email: string, password: string) => {
    const response = await apiInstance.post(`/${authRoot}/login`, {
      email,
      password,
    });
    return response.data;
  },

  getUserByToken: async (token: string): Promise<UserRegisterPayload> => {
    const response = await apiInstance.get(`${authRoot}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  },

  logoutUser: () => {
    localStorageService.removeToken();
  },
};
