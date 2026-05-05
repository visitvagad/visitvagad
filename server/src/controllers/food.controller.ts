import { Request, Response } from "express"
import Food from "../models/food.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"

export const getFoods = asyncHandler(async (_: Request, res: Response) => {
    const foods = await Food.find().sort({ name: 1 })
    res.status(200).json(new ApiResponse(200, foods, "Foods fetched successfully"))
})

export const getFood = asyncHandler(async (req: Request, res: Response) => {
    const food = await Food.findById(req.params.id)
    if (!food) throw new ApiError(404, "Food not found")
    res.status(200).json(new ApiResponse(200, food, "Food fetched successfully"))
})

export const createFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    const status = role === "admin" ? "published" : "pending_review"

    const food = await Food.create({
        ...req.body,
        status,
        createdBy: req.user?.id
    })
    res.status(201).json(new ApiResponse(201, food, "Food created successfully"))
})

export const updateFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: req.user?.id }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const food = await Food.findByIdAndUpdate(id, updateData, { new: true })
    if (!food) throw new ApiError(404, "Food not found")
    res.status(200).json(new ApiResponse(200, food, "Food updated successfully"))
})

export const deleteFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    if (role !== "admin") {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const food = await Food.findByIdAndDelete(req.params.id)
    if (!food) throw new ApiError(404, "Food not found")
    res.status(200).json(new ApiResponse(200, null, "Food deleted successfully"))
})
