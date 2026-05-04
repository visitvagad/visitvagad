import api from "./axiosInstance"

/* ---------- GET ALL PLACES ---------- */

export const getAllPlacesApi = (district?: string, category?: string, featured?: boolean, trending?: boolean) => {
    return api.get("/places", {
        params: {
            district,
            category,
            featured,
            trending
        }
    })
}

/* ---------- GET PLACE BY ID ---------- */

export const getPlaceByIdApi = (id: string) => {
    return api.get(`/places/${id}`)
}

/* ---------- CREATE PLACE ---------- */

export const createPlaceApi = (data: any) => {
    return api.post("/places", data)
}

/* ---------- UPDATE PLACE ---------- */

export const updatePlaceApi = (id: string, data: any) => {
    return api.patch(`/places/${id}`, data)
}

/* ---------- DELETE PLACE ---------- */

export const deletePlaceApi = (id: string) => {
    return api.delete(`/places/${id}`)
}

/* ---------- GET STATS ---------- */

export const getStatsApi = () => {
    return api.get("/places/stats")
}