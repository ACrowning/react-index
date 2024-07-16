import axios from "axios";
import { storage } from "../api/storage";

export const apiInstance = axios.create({
  baseURL: "http://localhost:4000/",
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = storage.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);
