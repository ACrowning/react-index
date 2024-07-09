import { apiInstance } from "./index";

const productRoot = "products";

export const products = {
  getProducts: async (
    searchElement: any,
    sortByPrice: any,
    page: any,
    pageSize: any
  ) => {
    try {
      const response = await apiInstance.post(`/${productRoot}`, {
        title: searchElement,
        sortByPrice,
        page,
        limit: pageSize,
      });

      return { data: response.data.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  getAllProducts: async () => {
    try {
      const response = await apiInstance.get(`/${productRoot}/all`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  getProductById: async (id: any) => {
    try {
      const response = await apiInstance.get(`/${productRoot}/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  deleteProduct: async (itemsId: any) => {
    try {
      const response = await apiInstance.delete(`/${productRoot}/${itemsId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  addProduct: async (newItem: any) => {
    try {
      const response = await apiInstance.post(
        `/${productRoot}/create`,
        newItem
      );
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  editTitle: async (productId: any, newText: any) => {
    try {
      const response = await apiInstance.put(`/${productRoot}/${productId}`, {
        title: newText,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  changeAmount: async (productId: any, newCount: any) => {
    try {
      const response = await apiInstance.put(
        `/${productRoot}/${productId}`,
        newCount
      );
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  updateProductAmount: async (itemsId: any, amount: any) => {
    try {
      const response = await apiInstance.put(`/${productRoot}/${itemsId}`, {
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
};
