import axiosInstance from './axios'

export const adminAPI = {
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  getUsers: (skip = 0, limit = 10) =>
    axiosInstance.get('/admin/users', { params: { skip, limit } }),
  getUserDetail: (id) => axiosInstance.get(`/admin/users/${id}`),
  deactivateUser: (id) => axiosInstance.put(`/admin/users/${id}/deactivate`),
  activateUser: (id) => axiosInstance.put(`/admin/users/${id}/activate`),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getAllPosts: (skip = 0, limit = 10) =>
    axiosInstance.get('/admin/posts', { params: { skip, limit } }),
  deletePostAdmin: (id) => axiosInstance.delete(`/admin/posts/${id}`),
}
