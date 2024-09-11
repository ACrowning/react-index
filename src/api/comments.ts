import { apiInstance } from "./index";

const commentRoot = "comments";

export const comments = {
  getComments: async () => {
    try {
      const response = await apiInstance.get(`/${commentRoot}`);
      const comments = response.data.data;
      return { data: comments, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  addComment: async (
    productId: string,
    text: string,
    user: string,
    parentCommentId?: string
  ) => {
    try {
      const response = await apiInstance.post(`/${commentRoot}/comment`, {
        productId,
        text,
        user,
        parentCommentId,
      });
      const newComment = response.data.data;
      return { data: newComment, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  getCommentsByProductId: async (productId: string) => {
    try {
      const response = await apiInstance.get(`/${commentRoot}/${productId}`);
      const comments = response.data.data;
      return { data: comments, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  updateComment: async (id: string, text: string) => {
    try {
      const response = await apiInstance.put(`/${commentRoot}/${id}`, { text });
      const updatedComment = response.data.data;
      return { data: updatedComment, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },

  deleteComment: async (id: string) => {
    try {
      const response = await apiInstance.delete(`/${commentRoot}/${id}`);
      const deletedComment = response.data.data;
      return { data: deletedComment, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Network response was not ok",
      };
    }
  },
};
