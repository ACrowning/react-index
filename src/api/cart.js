import { apiInstance } from "./index.js";
const cartRoot = "cart";

export const cart = {
  removeFromCart: async (itemsId) => {
    try {
      const response = await apiInstance.delete(`/${cartRoot}/${itemsId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  addToCart: async (newCount) => {
    try {
      const response = await apiInstance.post(`/${cartRoot}`, newCount);
      return { data: response.data, error: null };
    } catch (error) {
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
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  cartPlusMinus: async (itemsId, amount) => {
    try {
      const response = await apiInstance.put(`/${cartRoot}/${itemsId}`, amount);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
