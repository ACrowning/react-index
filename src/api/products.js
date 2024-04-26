import { apiInstance } from "./index.js";

export const products = {
  updateProductAmount: async (itemsId, amount) => {
    try {
      const response = await apiInstance.put(`/products/${itemsId}`, {
        amount,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  getProducts: async (searchElement, sortByPrice) => {
    try {
      const response = await apiInstance.post("/products", {
        title: searchElement,
        sortByPrice,
      });

      return { data: response.data.sortedElements, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiInstance.get(`/products/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
