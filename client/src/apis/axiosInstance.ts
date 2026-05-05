import axios from "axios"

export const AUTH_TOKEN_KEY = "auth_token"

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

export const persistAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
        localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    setAuthToken(token)
}

export const initializeAuthToken = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    setAuthToken(token)
    return token
}

/* ---------- RESPONSE INTERCEPTOR ---------- */

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            persistAuthToken(null)
        }
        return Promise.reject(error)
    }
)

export default api