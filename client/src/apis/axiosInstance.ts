import axios from "axios"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    }
})

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
        delete api.defaults.headers.common["Authorization"]
    }
}

/* ---------- RESPONSE INTERCEPTOR ---------- */

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized - could trigger a sign out or refresh here
        }
        return Promise.reject(error)
    }
)

export default api