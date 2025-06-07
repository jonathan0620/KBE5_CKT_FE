import axios from 'axios';

console.log('import.meta.env.VITE_API_WITH_CREDENTIALS > ', import.meta.env.VITE_API_WITH_CREDENTIALS);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS || true,
});

// Request 인터셉터 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 추가
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // 토큰 만료 시 리프레시 토큰으로 갱신
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`, { refreshToken });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
