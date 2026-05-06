import { Request, Response } from "express"
import Food from "../models/food.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"
import { 
  hasPermission, 
  canViewContent,
  getContentFilter,
  ContentStatus 
} from "../utils/permissions"
import { logAudit } from "../models/audit.models"

/* ---------- GET ALL FOODS ---------- */

export const getFoods = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query

    // ✅ Build filter based on user role
    const roleFilter = getContentFilter(req.user?.role || "user", req.user?.id || "")
    
    const skip = (Number(page) - 1) * Number(limit)

    const [foods, total] = await Promise.all([
        Food.find(roleFilter).skip(skip).limit(Number(limit)).sort({ name: 1 }),
        Food.countDocuments(roleFilter)
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            { foods, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
            "Foods fetched successfully"
        )
    )
})

/* ---------- GET FOOD BY ID ---------- */

export const getFood = asyncHandler(async (req: Request, res: Response) => {
    const food = await Food.findById(req.params.id)
    if (!food) throw new ApiError(404, "Food not found")

    // ✅ Check if user can view this food
    if (!canViewContent(food.status as ContentStatus, req.user?.role || "user", req.user?.id ?? "", food.createdBy)) {
        throw new ApiError(403, "You don't have permission to view this food")
    }

    res.status(200).json(new ApiResponse(200, food, "Food fetched successfully"))
})

/* ---------- CREATE FOOD ---------- */

export const createFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Only editors and admins can create
    if (!hasPermission(req.user!.role, 'create_content')) {
        throw new ApiError(403, "You don't have permission to create content")
    }

    const role = req.user!.role
    const status = role === "admin" ? "published" : "pending_review"

    const food = await Food.create({
        ...req.body,
        status,
        createdBy: req.user!.id
    })

    // ✅ Audit log
    await logAudit(
        req.user!.id,
        "CREATE_CONTENT",
        "Food",
        (food._id as unknown as string).toString(),
        food.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(201).json(new ApiResponse(201, food, "Food created successfully"))
})

/* ---------- UPDATE FOOD ---------- */

export const updateFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id
    
    // ✅ Load existing food
    const existingFood = await Food.findById(id)
    if (!existingFood) throw new ApiError(404, "Food not found")

    // ✅ OWNERSHIP CHECK: Editors can only edit their own
    if (role === "editor" && existingFood.createdBy !== userId) {
        await logAudit(
            userId,
            "UPDATE_CONTENT",
            "Food",
            id,
            existingFood.name,
            undefined,
            req.ip,
            req.get("user-agent"),
            "failure",
            "User tried to edit content they don't own"
        )
        throw new ApiError(403, "You can only edit content you created")
    }

    // ✅ Only admins can directly publish
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData: any = { ...req.body, updatedBy: userId }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const food = await Food.findByIdAndUpdate(id, updateData, { new: true })
    if (!food) throw new ApiError(404, "Food not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "UPDATE_CONTENT",
        "Food",
        id,
        food.name,
        { status: { before: existingFood.status, after: food.status } },
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, food, "Food updated successfully"))
})

/* ---------- DELETE FOOD ---------- */

export const deleteFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id

    // ✅ Only admins can delete
    if (!hasPermission(role, 'delete_any_content')) {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const food = await Food.findByIdAndDelete(id)
    if (!food) throw new ApiError(404, "Food not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "DELETE_CONTENT",
        "Food",
        id,
        food.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, null, "Food deleted successfully"))
})
