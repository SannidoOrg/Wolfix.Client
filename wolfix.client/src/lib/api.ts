import axios from "axios";

// Используем переменную окружения или фоллбэк на localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7168";

const api = axios.create({
    baseURL: baseURL,
    // Можно добавить заголовки, если нужно, например для CORS (хотя это настраивается на бэкенде)
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("authToken");
            if (typeof window !== 'undefined') {
                // Опционально: редирект на логин или просто очистка
                // window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;