import axios from 'axios';

const baseApi = axios.create({
    baseURL: 'http://localhost:9090',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Global response interceptor
baseApi.interceptors.response.use(
    (response) => {
        // If successful, just return response
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 500) {
                console.error("🚨 Internal Server Error:", error.response.data);

                // Optional: Show global toast notification
                // toast.error("Something went wrong on the server. Please try again later.");

                // Optional: return custom error object instead of throwing
                return Promise.reject({
                    status,
                    message: "Something went wrong on the server.",
                    original: error
                });
            }
        } else {
            console.error("❌ Network or CORS error:", error);
        }

        // Default: reject so caller can handle it
        return Promise.reject(error);
    }
);

export default baseApi;