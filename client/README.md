# VisitVagad Frontend

A high-performance React application built with Vite and Tailwind CSS v4, following the "Editorial Heritage" design system.

## 🎨 Design Philosophy: "The Modern Chronicler"

The UI is designed to feel like a sophisticated travel magazine:
- **Tonal Depth:** Layered surfaces (`surface`, `surface-container`) instead of shadows.
- **Translucent Horizon:** A glassmorphism navigation bar.
- **Editorial Typography:** Pairing Epilogue for headlines with Plus Jakarta Sans for body text.

## 🔐 Auth Integration

Powered by `@clerk/clerk-react`.
- Uses `ClerkProvider` in `main.tsx`.
- Custom `RoleRoute` component for protecting sensitive areas.
- Automatic token synchronization with backend via Axios interceptors.

## 📸 Image Management

Utilizes `@imagekit/react` for direct-to-cloud uploads.
- Optimized delivery with `q-auto, f-auto`.
- Real-time transformations for different viewports.

## ⚙️ Environment Variables

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```
