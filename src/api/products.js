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
  deleteProduct: async (itemsId) => {
    try {
      const response = await apiInstance.delete(`/products/${itemsId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  addProduct: async (newItem) => {
    try {
      const response = await apiInstance.post("/products/create", newItem);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  editTitle: async (productId, newText) => {
    try {
      const response = await apiInstance.put(`/products/${productId}`, {
        title: newText,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
  changeAmount: async (productId, newCount) => {
    try {
      const response = await apiInstance.put(
        `/products/${productId}`,
        newCount
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
