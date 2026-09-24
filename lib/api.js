import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            new Error(error.response?.data?.message || error.message || 'Request failed')
        )
);
