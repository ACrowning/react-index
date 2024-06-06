import { apiInstance } from "./index.js";

const commentRoot = "comments";

export const comments = {
  addComment: async (newComment) => {
    try {
      const response = await apiInstance.post(
        `/${commentRoot}/comment`,
        newComment
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  editComment: async (commentId, text) => {
    try {
      const response = await apiInstance.put(`/${commentRoot}/${commentId}`, {
        text,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await apiInstance.delete(`/${commentRoot}/${commentId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "Network response was not ok",
      };
    }
  },
};
