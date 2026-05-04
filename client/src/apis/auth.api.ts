import api from "./axiosInstance"

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