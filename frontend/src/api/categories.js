import axiosInstance from './axios'

export const categoriesAPI = {
  getCategories: (skip = 0, limit = 100) =>
    axiosInstance.get('/categories', { params: { skip, limit } }),
  getCategoryById: (id) => axiosInstance.get(`/categories/${id}`),
  searchCategories: (query, skip = 0, limit = 10) =>
    axiosInstance.get('/categories/search', { params: { q: query, skip, limit } }),
  createCategory: (data) => axiosInstance.post('/categories', data),
  updateCategory: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
}
