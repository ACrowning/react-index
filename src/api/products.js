import { apiInstance } from "./index.js";

const productRoot = "products";

export const products = {
  getProducts: async (searchElement, sortByPrice, page, pageSize) => {
    try {
      const response = await apiInstance.post(`/${productRoot}`, {
        title: searchElement,
        sortByPrice,
        page,
        limit: pageSize,
      });

      return { data: response.data.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiInstance.get(`/${productRoot}/${id}`);
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
      const response = await apiInstance.delete(`/${productRoot}/${itemsId}`);
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
      const response = await apiInstance.post(
        `/${productRoot}/create`,
        newItem
      );
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
      const response = await apiInstance.put(`/${productRoot}/${productId}`, {
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
        `/${productRoot}/${productId}`,
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

  updateProductAmount: async (itemsId, amount) => {
    try {
      const response = await apiInstance.put(`/${productRoot}/${itemsId}`, {
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
};
