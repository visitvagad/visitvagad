# ✅ Deployment Configuration Checklist

## 🔧 Current Issue: API 404 Errors

**Symptoms**:
- "Route /auth/register not found" errors
- "Error fetching homepage data: 404"
- CORS/OpaqueResponseBlocking errors for images

**Root Causes**:
1. Backend CORS not configured for frontend domain
2. Missing environment variables on Render
3. Missing VITE_API_URL in Vercel
4. Image loading blocked due to CORS

---

## 🚀 Required Configuration

### 1️⃣ Render Backend Configuration (visit-vagad-server)

Go to [Render Dashboard](https://dashboard.render.com)

#### Environment Variables:
Set these in the **Environment** tab:

```
MONGO_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/visitvagad?retryWrites=true&w=majority

JWT_SECRET=[Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]

JWT_EXPIRES_IN=7d

CORS_ORIGIN=https://visitvagad.vercel.app

NODE_ENV=production

PORT=5000

IMAGEKIT_PUBLIC_KEY=[from ImageKit dashboard]

IMAGEKIT_PRIVATE_KEY=[from ImageKit dashboard]

IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/[your-id]
```

**⚠️ Critical**: `CORS_ORIGIN` MUST be set to your Vercel frontend URL

#### Build Configuration:
- **Root Directory**: `server`
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`

#### Verify Deployment:
```bash
# Test the backend is running
curl https://visitvagad-server.onrender.com/api/places

# Should return a valid JSON response (not 404)
```

---

### 2️⃣ Vercel Frontend Configuration (visitvagad)

Go to [Vercel Dashboard](https://vercel.com/dashboard)

#### Environment Variables:
Set these in **Settings** → **Environment Variables**:

```
VITE_API_URL=https://visitvagad-server.onrender.com
```

This tells the client where the backend API is located.

#### Build Settings:
- **Framework**: Other (Vite)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install` (in root or `cd client && npm install`)

#### Verify Deployment:
1. Visit https://visitvagad.vercel.app
2. Open browser console (F12)
3. Should NOT see 404 errors

---

## 📋 Verification Checklist

- [ ] **Render Backend**
  - [ ] Service created and deployed
  - [ ] MONGO_URI environment variable is set ✅
  - [ ] JWT_SECRET environment variable is set ✅
  - [ ] CORS_ORIGIN = `https://visitvagad.vercel.app` ✅
  - [ ] IMAGEKIT credentials set ✅
  - [ ] Test: `curl https://visitvagad-server.onrender.com/api/places` returns data
  - [ ] No "Service suspended" message

- [ ] **Vercel Frontend**
  - [ ] Project deployed successfully
  - [ ] VITE_API_URL = `https://visitvagad-server.onrender.com` ✅
  - [ ] Build logs show no errors
  - [ ] Frontend loads without console errors

- [ ] **Browser Console**
  - [ ] No CORS errors
  - [ ] No 404 errors
  - [ ] No OpaqueResponseBlocking errors

---

## 🐛 Troubleshooting

### ❌ Still getting 404 errors?

**Step 1**: Verify Render URL
```bash
# Ping the backend
curl https://visitvagad-server.onrender.com/api/places

# If this fails, check:
# 1. Service is deployed (not suspended)
# 2. URL spelling is correct
# 3. Service has finished booting (wait 30-60 seconds after deployment)
```

**Step 2**: Check CORS_ORIGIN
```bash
# The server logs should show CORS configuration
# If CORS_ORIGIN is not set, requests will be blocked
```

**Step 3**: Check Vercel rewrites
- Open DevTools Network tab
- Try to register or login
- Check the request URL - should be `/api/auth/register`
- Check response status - should NOT be 404

### ❌ Getting CORS errors?

This means:
1. Request is reaching backend ✅
2. But origin is not in allowed list ❌

**Fix**: Ensure `CORS_ORIGIN` includes the Vercel domain:
```
CORS_ORIGIN=https://visitvagad.vercel.app
```

### ❌ Images not loading (OpaqueResponseBlocking)?

The backend now has CSP headers configured. If still getting blocked:
1. Check image sources are HTTPS
2. Verify Unsplash/ImageKit domains are accessible
3. Check browser DevTools Network tab for image requests

---

## 🔄 Redeployment Steps

If you make code changes:

### Backend (Render)
1. Push to GitHub
2. Render auto-deploys OR
3. Manual redeploy: Dashboard → Logs → Manual Deploy

### Frontend (Vercel)
1. Push to GitHub
2. Vercel auto-deploys

---

## 📞 Getting Help

If issues persist:

1. **Check Render Logs**: Dashboard → Logs (look for error messages)
2. **Check Vercel Logs**: Deployments → Click recent deployment → Logs
3. **Check Browser Console**: F12 → Console tab (for client-side errors)
4. **Check Network Tab**: F12 → Network → Try registration/login and inspect requests

---

## ✅ Recent Fixes Applied

- ✅ Updated CORS configuration to accept multiple origins
- ✅ Added CSP headers for image loading
- ✅ Updated vercel.json with correct Render URL
- ✅ Documented environment variable requirements
