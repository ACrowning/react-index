import { apiInstance } from "./index";
const cartRoot = "cart";

export const cart = {
  removeFromCart: async (itemsId: any) => {
    try {
      const response = await apiInstance.delete(`/${cartRoot}/${itemsId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  addToCart: async (newCount: any) => {
    try {
      const response = await apiInstance.post(`/${cartRoot}`, newCount);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  getCart: async () => {
    try {
      const response = await apiInstance.get(`/${cartRoot}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  cartPlusMinus: async (itemsId: any, amount: any) => {
    try {
      const response = await apiInstance.put(`/${cartRoot}/${itemsId}`, amount);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
