import { apiClient } from "@/helper/apiClient";
const baseUrl = "http://localhost:5000/api";
export const commentApi = {
  clientGetComments: async (
    post_id: number,
    signal: AbortSignal,
    comment_id?: number
  ) => {
    const url = comment_id
      ? `${baseUrl}/posts/${post_id}/comments/${comment_id}/replies`
      : `${baseUrl}/posts/${post_id}/comments`;

    return apiClient({
      method: "GET",
      url: url,
      schema: (data) => data,
      signal: signal,
    });
  },

  clientCreateComment: async (
    data: any,
    signal: AbortSignal,
  ) => {
    const {  post_id , comment_id } = data;
    const url = comment_id
      ? `${baseUrl}/posts/${post_id}/comments/${comment_id}/replies`
      : `${baseUrl}/posts/${post_id}/comments`;

    return apiClient({
      method: "POST",
      url: url,
      body: data,
      schema: (data) => data,
      signal: signal,
    });
  },
};
