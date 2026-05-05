# VisitVagad Backend

The server-side of VisitVagad is built with Node.js and Express, utilizing MongoDB for data persistence and JWT-based authentication.

## 🔐 Authentication & RBAC

The system uses JWT token verification for all protected routes.
- **Admin:** Full access to all resources and user role management.
- **Editor:** Permission to create and update heritage places.
- **User:** Read-only access to places and ability to create personal itineraries.

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and receive JWT.
- `GET /api/auth/me` - Get current user profile.
- `GET /api/auth/users` - (Admin) List all users.
- `PATCH /api/auth/users/:id/role` - (Admin) Update a user's role.

### Places
- `GET /api/places` - Get all places (with district/category filters).
- `GET /api/places/:id` - Get a specific place.
- `POST /api/places` - (Admin/Editor) Create a new place.
- `PATCH /api/places/:id` - (Admin/Editor) Update a place.
- `DELETE /api/places/:id` - (Admin) Delete a place.

### Images
- `GET /api/images/auth` - Get ImageKit authentication parameters.

## ⚙️ Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
IMAGEKIT_PUBLIC_KEY=your_imagekit_public
IMAGEKIT_PRIVATE_KEY=your_imagekit_private
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```
