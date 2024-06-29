import { apiInstance } from "./index";

const commentRoot = "comments";

export const comments = {
  addComment: async (newComment: any) => {
    try {
      const response = await apiInstance.post(
        `/${commentRoot}/comment`,
        newComment
      );
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  editComment: async (commentId: any, text: any) => {
    try {
      const response = await apiInstance.put(`/${commentRoot}/${commentId}`, {
        text,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  deleteComment: async (commentId: any) => {
    try {
      const response = await apiInstance.delete(`/${commentRoot}/${commentId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
