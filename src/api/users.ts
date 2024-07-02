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
};
