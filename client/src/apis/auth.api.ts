import api from "./axiosInstance"

export const registerApi = (payload: { name: string; email: string; password: string }) => {
    return api.post("/auth/register", payload)
}

export const loginApi = (payload: { email: string; password: string }) => {
    return api.post("/auth/login", payload)
}

// ✅ Add logout API call
export const logoutApi = () => {
    return api.post("/auth/logout")
}

/* ---------- GET CURRENT USER ---------- */

export const getMeApi = () => {
    return api.get("/auth/me")
}

export const getAllUsersApi = () => {
    return api.get("/auth/users")
}

export const updateUserRoleApi = (id: string, role: string) => {
    return api.patch(`/auth/users/${id}/role`, { role })
}

export const deleteUserApi = (id: string) => {
    return api.delete(`/auth/users/${id}`)
}