import axios from "axios"

export const AUTH_TOKEN_KEY = "auth_token"

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "") + "/api",
    headers: {
        "Content-Type": "application/json"
    },
    // ✅ CRITICAL: Send cookies with all requests
    // This allows httpOnly cookies to be sent automatically
    withCredentials: true
})

// ✅ Legacy localStorage logic removed - auth is now handled by httpOnly cookies
// This prevents XSS vulnerabilities and ensures consistency on refresh

/* ---------- RESPONSE INTERCEPTOR ---------- */

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // ✅ Handle 401: The server has already cleared the cookie if necessary
            // or the cookie was missing. AuthContext will handle the state update.
        }
        return Promise.reject(error)
    }
)

export default api