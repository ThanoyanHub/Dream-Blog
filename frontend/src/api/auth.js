import axiosInstance from './axios'

export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh', { refresh_token: refreshToken }),
}
