  import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/config';
import connectDB from './db/connectDatabase';
import authRouter from "./routes/auth.routes"
import placeRouter from "./routes/place.routes"
import imageRouter from "./routes/image.routes"
import hotelRouter from "./routes/hotel.routes"
import eventRouter from "./routes/event.routes"
import foodRouter from "./routes/food.routes"
import itineraryRouter from "./routes/itinerary.routes"
import { ApiError } from './utils'


const app = express();
const PORT = config.port || 5000;

/* ---------- SECURITY MIDDLEWARE ---------- */
app.use(helmet({
  // Allow images from external sources (Unsplash, ImageKit, etc.)
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", "https:", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(cors({
  origin: (origin, callback) => {
    // Build allowed origins from environment and defaults
    const corsOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [];
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.CORS_ORIGIN || 'http://localhost:5173'
    ];
    
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Add cookie parser for httpOnly cookies
app.use(cookieParser());

// ✅ Auth rate limiter (strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Only 5 login attempts
  skipSuccessfulRequests: true, // Don't count successful logins
  message: {
    success: false,
    message: "Too many login/register attempts, please try again after 15 minutes"
  }
  // ✅ Uses default keyGenerator which properly handles IPv6 addresses
});

// ✅ Global rate limiter (lenient)
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // 100 requests per 15 minutes
	standardHeaders: 'draft-7',
	legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api", globalLimiter);

/* ---------- PARSING MIDDLEWARE ---------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRouter)
app.use("/api/places", placeRouter)
app.use("/api/images", imageRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/events", eventRouter)
app.use("/api/food", foodRouter)
app.use("/api/itineraries", itineraryRouter)

/* ---------- 404 HANDLER ---------- */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

/* ---------- GLOBAL ERROR HANDLER MIDDLEWARE ---------- */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map((e: any) => e.message)
    });
  }

  // Default error response
  console.error('Unhandled error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

/* ---------- START SERVER ---------- */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
