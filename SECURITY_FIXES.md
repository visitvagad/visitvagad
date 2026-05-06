# 🔧 SECURITY FIXES - IMPLEMENTATION GUIDE

## Priority: CRITICAL

These fixes must be implemented before any production deployment. Average implementation time: **5-6 hours**

---

## FIX #1: Authorization Route Mismatch (30 minutes)

### Files to Update: 4 route files

#### 1. server/src/routes/food.routes.ts

**Line 11 - Change DELETE route**

```typescript
// ❌ BEFORE
.delete(protect, authorize("admin", "editor"), deleteFood)

// ✅ AFTER
.delete(protect, authorize("admin"), deleteFood)
```

#### 2. server/src/routes/event.routes.ts

**Line 11 - Change DELETE route**

```typescript
// ❌ BEFORE
.delete(protect, authorize("admin", "editor"), deleteEvent)

// ✅ AFTER
.delete(protect, authorize("admin"), deleteEvent)
```

#### 3. server/src/routes/hotel.routes.ts

**Line 11 - Change DELETE route**

```typescript
// ❌ BEFORE
.delete(protect, authorize("admin", "editor"), deleteHotel)

// ✅ AFTER
.delete(protect, authorize("admin"), deleteHotel)
```

#### 4. server/src/routes/itinerary.routes.ts

**Line 10 - Change DELETE route**

```typescript
// ❌ BEFORE
.delete(protect, authorize("admin", "editor"), deleteItinerary)

// ✅ AFTER
.delete(protect, authorize("admin"), deleteItinerary)
```

---

## FIX #2: Content Ownership Validation (2 hours)

Add this check to ALL update controllers. Pattern shown below.

### Files to Update: 5 controller files

#### 1. server/src/controllers/place.controller.ts

**Replace the `updatePlace` function entirely:**

```typescript
export const updatePlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    const userId = req.user?.id
    
    // ✅ Load the existing document first
    const existingPlace = await Place.findById(id)
    if (!existingPlace) {
        throw new ApiError(404, "Place not found")
    }
    
    // ✅ OWNERSHIP CHECK: Editors can only edit their own content
    if (role === "editor" && existingPlace.createdBy !== userId) {
        throw new ApiError(403, "Can only edit content you created")
    }
    
    // ✅ Only admins can directly publish
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { 
        ...req.body, 
        updatedBy: userId
    }
    
    // ✅ If editor updates, auto-revert to pending_review (unless just saving draft)
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const place = await Place.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })

    res.status(200).json(
        new ApiResponse(200, place, "Place updated successfully")
    )
})
```

#### 2. server/src/controllers/hotel.controller.ts

**Replace the `updateHotel` function:**

```typescript
export const updateHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    const userId = req.user?.id
    
    // ✅ Load existing first
    const existingHotel = await Hotel.findById(id)
    if (!existingHotel) throw new ApiError(404, "Hotel not found")
    
    // ✅ OWNERSHIP CHECK
    if (role === "editor" && existingHotel.createdBy !== userId) {
        throw new ApiError(403, "Can only edit content you created")
    }
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: userId }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true })
    res.status(200).json(new ApiResponse(200, hotel, "Hotel updated successfully"))
})
```

#### 3. server/src/controllers/event.controller.ts

**Replace the `updateEvent` function:**

```typescript
export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    const userId = req.user?.id
    
    const existingEvent = await Event.findById(id)
    if (!existingEvent) throw new ApiError(404, "Event not found")
    
    // ✅ OWNERSHIP CHECK
    if (role === "editor" && existingEvent.createdBy !== userId) {
        throw new ApiError(403, "Can only edit content you created")
    }
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: userId }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true })
    res.status(200).json(new ApiResponse(200, event, "Event updated successfully"))
})
```

#### 4. server/src/controllers/food.controller.ts

**Replace the `updateFood` function:**

```typescript
export const updateFood = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    const userId = req.user?.id
    
    const existingFood = await Food.findById(id)
    if (!existingFood) throw new ApiError(404, "Food not found")
    
    // ✅ OWNERSHIP CHECK
    if (role === "editor" && existingFood.createdBy !== userId) {
        throw new ApiError(403, "Can only edit content you created")
    }
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: userId }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const food = await Food.findByIdAndUpdate(id, updateData, { new: true })
    res.status(200).json(new ApiResponse(200, food, "Food updated successfully"))
})
```

#### 5. server/src/controllers/itinerary.controller.ts

**Replace the `updateItinerary` function:**

```typescript
export const updateItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    const userId = req.user?.id
    
    const existingItinerary = await Itinerary.findById(id)
    if (!existingItinerary) throw new ApiError(404, "Itinerary not found")
    
    // ✅ OWNERSHIP CHECK
    if (role === "editor" && existingItinerary.createdBy !== userId) {
        throw new ApiError(403, "Can only edit content you created")
    }
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: userId }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const itinerary = await Itinerary.findByIdAndUpdate(id, updateData, { new: true })
    res.status(200).json(new ApiResponse(200, itinerary, "Itinerary updated successfully"))
})
```

---

## FIX #3: Move Token to HttpOnly Cookie (2-3 hours)

### BACKEND CHANGES

#### server/src/controllers/auth.controller.ts

**Replace BOTH register and login functions:**

```typescript
import cookieParser from 'cookie-parser'

// Helper function to set auth cookie
const setAuthCookie = (res: Response, token: string) => {
  res.cookie('auth_token', token, {
    httpOnly: true,                    // ✅ Not accessible to JavaScript
    secure: process.env.NODE_ENV === 'production',  // ✅ HTTPS only in production
    sameSite: 'strict',                // ✅ CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000    // 7 days
  })
}

/* ---------- REGISTER ---------- */
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body

  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
    isActive: true,
  })

  const token = generateToken((user._id as unknown as string).toString())

  // ✅ Set cookie instead of returning token
  setAuthCookie(res, token)

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Registered successfully"
    )
  )
})

/* ---------- LOGIN ---------- */
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  if (!user.isActive) {
    throw new ApiError(401, "User account has been deactivated")
  }

  if (!user.password) {
    throw new ApiError(401, "Password login is not available for this account")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password")
  }

  const token = generateToken((user._id as unknown as string).toString())

  // ✅ Set cookie instead of returning token
  setAuthCookie(res, token)

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    )
  )
})

/* ---------- LOGOUT ---------- */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // ✅ Clear cookie
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })

  res.status(200).json(
    new ApiResponse(200, null, "Logged out successfully")
  )
})
```

#### server/src/index.ts

**Add cookie-parser middleware:**

```typescript
import cookieParser from 'cookie-parser'

const app = express()

// Add this near the top, after helmet()
app.use(cookieParser())

// ... rest of middleware
```

#### server/src/middlewares/auth.middleware.ts

**Update protect middleware to read from cookie:**

```typescript
export const protect = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {

        // ✅ Check both Authorization header AND cookie
        const authHeader = req.headers.authorization
        const tokenFromHeader = authHeader?.startsWith("Bearer ") 
            ? authHeader.split(" ")[1] 
            : null
        
        const tokenFromCookie = (req.cookies as any)?.auth_token
        
        const token = tokenFromHeader || tokenFromCookie

        if (!token) {
            throw new ApiError(401, "Authorization token required")
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret) as { id?: string }

            if (!decoded?.id) {
                throw new ApiError(401, "Invalid token payload")
            }

            const user = await User.findById(decoded.id)

            if (!user || !user.isActive) {
                throw new ApiError(401, "User account has been deactivated")
            }

            req.user = {
                id: (user._id as unknown as string).toString(),
                role: user.role
            }

            next()
        } catch (error) {
            console.error("Token verification error:", error)
            throw new ApiError(401, "Invalid or expired token")
        }
    }
)
```

#### server/src/routes/auth.routes.ts

**Add logout route:**

```typescript
import { logout } from "../controllers/auth.controller"

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", protect, logout)  // ✅ Add this
router.get("/me", protect, getMe)

// ... rest of routes
```

### FRONTEND CHANGES

#### client/src/apis/axiosInstance.ts

**Complete rewrite:**

```typescript
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true  // ✅ IMPORTANT: Send cookies with requests
})

// ✅ No token management needed - cookie sent automatically

export const setAuthToken = (token: string | null) => {
    // Deprecated - kept for backward compatibility
    // Token is now managed via httpOnly cookie
}

export const persistAuthToken = (token: string | null) => {
    // Deprecated - kept for backward compatibility  
    // Token is now managed via httpOnly cookie
}

export const initializeAuthToken = () => {
    // ✅ No need to read from localStorage
    // Cookie is automatically sent with requests
    return null
}

/* ---------- RESPONSE INTERCEPTOR ---------- */
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // ✅ Handle 401 - clear auth state
        if (error.response && error.response.status === 401) {
            // Optional: Clear local auth context
            // This will be refreshed on next getMeApi call
        }
        return Promise.reject(error)
    }
)

export default api
```

#### client/src/context/AuthContext.tsx

**Update functions that no longer need to persist token:**

```typescript
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, registerApi, getMeApi } from "../apis/auth.api";
import { initializeAuthToken } from "../apis/axiosInstance";
import type { IUser } from "../types";

interface AuthContextType {
  user: IUser | null;
  role: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;  // ✅ Now async
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const applyUserState = (nextUser: IUser | null) => {
    setUser(nextUser);
    setRole(nextUser?.role || null);
    setIsSignedIn(Boolean(nextUser));
  };

  const fetchUser = async () => {
    try {
      const res = await getMeApi();
      const userData = res?.data?.data as IUser | undefined;
      applyUserState(userData || null);
    } catch {
      applyUserState(null);
    }
  };

  useEffect(() => {
    const boot = async () => {
      // ✅ No need to check localStorage
      await fetchUser();
      setIsLoading(false);
    };

    boot();
  }, []);

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    const userData = res?.data?.data?.user as IUser;
    // ✅ Cookie is set automatically by the response
    applyUserState(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerApi({ name, email, password });
    const userData = res?.data?.data?.user as IUser;
    // ✅ Cookie is set automatically by the response
    applyUserState(userData);
  };

  const logout = async () => {
    // ✅ Call logout endpoint to clear cookie
    try {
      await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      console.error("Logout error:", e);
    }
    applyUserState(null);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      isLoading,
      isSignedIn,
      refreshUser,
      login,
      register,
      logout,
    }),
    [user, role, isLoading, isSignedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
};
```

---

## FIX #4: Role-Based GET Filtering (1 hour)

### server/src/controllers/place.controller.ts

**Update getAllPlaces:**

```typescript
export const getAllPlaces = asyncHandler(async (req: Request, res: Response) => {
    const { district, category, featured, trending, status, createdBy, page = 1, limit = 10 } = req.query

    const filter: any = {}

    if (district) filter.district = district
    if (category) filter.category = category
    if (featured !== undefined) filter.featured = featured === 'true'
    if (trending !== undefined) filter.trending = trending === 'true'

    // ✅ ROLE-BASED FILTERING
    if (!req.user) {
        // ✅ Public users only see published content
        filter.status = 'published'
    } else if (req.user.role === 'editor') {
        // ✅ Editors see published + their own (any status)
        filter.$or = [
            { status: 'published' },
            { createdBy: req.user.id }
        ]
    }
    // ✅ Admins see everything (no filter applied)
    
    // Allow filtering by status only if authorized
    if (status) {
        if (!req.user || (req.user.role === 'editor' && status !== 'published')) {
            // Non-admins can only explicitly request 'published'
            if (status !== 'published') {
                throw new ApiError(403, "Cannot filter by non-published status")
            }
        }
        filter.status = status
    }

    if (createdBy && req.user?.role === 'admin') {
        // Only admins can filter by createdBy
        filter.createdBy = createdBy
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [places, total] = await Promise.all([
        Place.find(filter).skip(skip).limit(Number(limit)),
        Place.countDocuments(filter)
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            {
                places,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            },
            "Places fetched successfully"
        )
    )
})
```

### server/src/controllers/hotel.controller.ts

**Update getHotels:**

```typescript
export const getHotels = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Apply same filtering as places
    const filter: any = {}
    
    if (!req.user) {
        filter.status = 'published'
    } else if (req.user.role === 'editor') {
        filter.$or = [
            { status: 'published' },
            { createdBy: req.user.id }
        ]
    }
    
    const hotels = await Hotel.find(filter).sort({ createdAt: -1 })
    res.status(200).json(new ApiResponse(200, hotels, "Hotels fetched successfully"))
})
```

### Repeat for: event.controller.ts, food.controller.ts, itinerary.controller.ts

Use the same pattern for all GET endpoints.

---

## FIX #5: Frontend Ownership Validation (30 minutes)

### client/src/admin/pages/DestinationForm.tsx

**Add ownership check in useEffect:**

```typescript
useEffect(() => {
    if (id) {
      api.get(`/places/${id}`)
        .then(res => {
          const data = res.data.data
          
          // ✅ OWNERSHIP CHECK for editors
          if (role === 'editor' && data.createdBy !== user?.id) {
            toast.error('You can only edit content you created')
            navigate('/admin/destinations')
            return
          }
          
          reset(data)
          setFetching(false)
        })
        .catch(() => {
          toast.error('Failed to load destination')
          navigate('/admin/destinations')
        })
    }
}, [id, reset, navigate, role, user?.id])
```

**Repeat for:** HotelForm, EventForm, FoodForm, ItineraryForm

---

## FIX #6: Remove Debug Endpoints (15 minutes)

### server/src/index.ts

Remove this line if it exists:
```typescript
// ❌ DELETE THIS LINE
app.use("/api", debugRouter)
```

Or in development only:
```typescript
// ✅ Keep only if needed
if (process.env.NODE_ENV === 'development') {
    app.use("/api", debugRouter)
}
```

---

## FIX #7: Auth Rate Limiting (30 minutes)

### server/src/index.ts

**Add before other routes:**

```typescript
// ✅ Strict rate limiter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 5,  // Only 5 attempts
  skipSuccessfulRequests: true,  // Don't count successful logins
  message: {
    success: false,
    message: "Too many login attempts, please try again later"
  }
})

// Apply to auth routes
app.use("/api/auth/login", authLimiter)
app.use("/api/auth/register", authLimiter)

// Global limiter (100 per 15 min) for other endpoints
app.use("/api", limiter)
```

---

## Implementation Checklist

- [ ] FIX #1: Update 4 route files (30 min)
- [ ] FIX #2: Add ownership checks to 5 controllers (2 hours)
- [ ] FIX #3: Move token to httpOnly cookies (2-3 hours)
- [ ] FIX #4: Add GET filtering (1 hour)
- [ ] FIX #5: Add frontend ownership checks (30 min)
- [ ] FIX #6: Remove debug endpoints (15 min)
- [ ] FIX #7: Add auth rate limiting (30 min)
- [ ] Test all fixes
- [ ] Update API documentation
- [ ] Run security tests
- [ ] Deploy to staging
- [ ] Approval from security team

**Total Time: 6-8 hours for competent developer**

---

## Testing After Fixes

```bash
# Test 1: Editor cannot delete
curl -X DELETE http://localhost:5000/api/places/123 \
  -H "Authorization: Bearer [editor-token]"
# Should return: 403 Forbidden

# Test 2: Editor cannot edit others' content
curl -X PATCH http://localhost:5000/api/places/456 \
  -H "Authorization: Bearer [editor-token]" \
  -H "Content-Type: application/json" \
  -d '{"description":"hacked"}'
# Should return: 403 Can only edit your own content

# Test 3: Public cannot see drafts
curl http://localhost:5000/api/places
# Should return: only published content

# Test 4: Token in cookie not in body
curl -X GET http://localhost:5000/api/auth/me
# Should work via cookie, no token in body needed
```

---

**Generated:** May 6, 2026
