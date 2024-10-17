import { apiInstance } from "./index";
const cartRoot = "cart";

export const cart = {
  addToCart: async (userId: string, productId: string, amount: number) => {
    try {
      const response = await apiInstance.post(`/${cartRoot}/add`, {
        userId,
        productId,
        amount,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  updateCartItem: async (cartId: string, productId: string, amount: number) => {
    try {
      const response = await apiInstance.put(`/${cartRoot}/update`, {
        cartId,
        productId,
        amount,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  removeFromCart: async (
    cartItemId: string,
    userId: string,
    productId: string,
    amount: number
  ) => {
    try {
      const response = await apiInstance.post(`/${cartRoot}/delete`, {
        cartItemId,
        userId,
        productId,
        amount,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  getCart: async (userId: string) => {
    try {
      const response = await apiInstance.get(`/${cartRoot}/${userId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
