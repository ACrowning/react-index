import { apiInstance } from "./index";

const productRoot = "products";

export const products = {
  getProducts: async (params: {
    title?: string;
    sortByPrice?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await apiInstance.post(`/${productRoot}`, params);

      const products = response.data.data;
      const total = response.data.total;

      return { data: { products, total }, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  getProductById: async (productId: any) => {
    try {
      const response = await apiInstance.get(`/${productRoot}/${productId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  createProduct: async (newItem: any) => {
    try {
      const response = await apiInstance.post(
        `/${productRoot}/create`,
        newItem
      );
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  updateProduct: async (productId: any, updatedFields: any) => {
    try {
      const response = await apiInstance.put(`/${productRoot}/${productId}`, {
        ...updatedFields,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      const response = await apiInstance.delete(`/${productRoot}/${productId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },
};
