import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/config';
import connectDB from './db/connectDatabase';
import authRouter from "./routes/auth.routes"
import placeRouter from "./routes/place.routes"
import imageRouter from "./routes/image.routes"
import { ApiError } from './utils'


const app = express();
const PORT = config.port || 5000;

/* ---------- SECURITY MIDDLEWARE ---------- */
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // set `RateLimit` and `RateLimit-Policy` headers
	legacyHeaders: false, // disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

app.use("/api", limiter);

/* ---------- PARSING MIDDLEWARE ---------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRouter)
app.use("/api/places", placeRouter)
app.use("/api/images", imageRouter)

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
