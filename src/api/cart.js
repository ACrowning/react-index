import { apiInstance } from "./index.js";

const cart = {
  removeFromCart: async (itemsId) => {
    try {
      const response = await apiInstance.delete(`/cart/${itemsId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};

export default cart;
