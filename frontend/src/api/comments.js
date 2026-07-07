import axiosInstance from './axios'

export const commentsAPI = {
  getCommentById: (id) => axiosInstance.get(`/comments/${id}`),
  getPostComments: (postId, skip = 0, limit = 10) =>
    axiosInstance.get(`/comments/post/${postId}`, { params: { skip, limit } }),
  createComment: (postId, data) =>
    axiosInstance.post('/comments', data, { params: { post_id: postId } }),
  updateComment: (id, data) => axiosInstance.put(`/comments/${id}`, data),
  deleteComment: (id) => axiosInstance.delete(`/comments/${id}`),
}
