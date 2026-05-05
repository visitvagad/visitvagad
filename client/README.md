# VisitVagad Frontend

A high-performance React application built with Vite and Tailwind CSS v4, following the "Editorial Heritage" design system.

## 🎨 Design Philosophy: "The Modern Chronicler"

The UI is designed to feel like a sophisticated travel magazine:
- **Tonal Depth:** Layered surfaces (`surface`, `surface-container`) instead of shadows.
- **Translucent Horizon:** A glassmorphism navigation bar.
- **Editorial Typography:** Pairing Epilogue for headlines with Plus Jakarta Sans for body text.

## 🔐 Auth Integration

Powered by backend JWT authentication.
- Uses `AuthProvider` in `main.tsx`.
- Custom `ProtectedRoute` and `RoleRoute` components for route protection.
- Token persistence and sync through `axiosInstance.ts`.

## 📸 Image Management

Utilizes `@imagekit/react` for direct-to-cloud uploads.
- Optimized delivery with `q-auto, f-auto`.
- Real-time transformations for different viewports.

## ⚙️ Environment Variables

```env
VITE_API_URL=http://localhost:5000
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```
