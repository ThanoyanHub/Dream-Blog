import axiosInstance from './axios'

export const postsAPI = {
  getPosts: (skip = 0, limit = 10, categoryId = null) =>
    axiosInstance.get('/posts', { params: { skip, limit, category_id: categoryId } }),
  getMyPosts: (skip = 0, limit = 10) =>
    axiosInstance.get('/posts/my-posts', { params: { skip, limit } }),
  getPostById: (id) =>
    axiosInstance.get(`/posts/${id}`),
  searchPosts: (query, skip = 0, limit = 10) =>
    axiosInstance.get('/posts/search', { params: { q: query, skip, limit } }),
  createPost: (data) => axiosInstance.post('/posts', data),
  updatePost: (id, data) => axiosInstance.put(`/posts/${id}`, data),
  deletePost: (id) => axiosInstance.delete(`/posts/${id}`),
  likePost: (id) => axiosInstance.post(`/posts/${id}/like`),
  unlikePost: (id) => axiosInstance.post(`/posts/${id}/unlike`),
}
