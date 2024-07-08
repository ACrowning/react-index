import { apiInstance } from "./index";

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

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  token: string;
}

export const users = {
  registerUser: async (
    user: UserRegisterPayload
  ): Promise<{ user: User; token: string }> => {
    const response = await apiInstance.post(`/${authRoot}/signup`, user);
    return response.data;
  },

  loginUser: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const response = await apiInstance.post(`/${authRoot}/login`, {
      email,
      password,
    });
    return response.data;
  },

  getUserByToken: async (token: string): Promise<User> => {
    const response = await apiInstance.get(`${authRoot}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  },
};
