# 🔧 Quick Fix: API 404 Errors & CORS Issues

## 📍 Your Current Errors

```
Route /auth/register not found
Error fetching homepage data: AxiosError: Request failed with status code 404
Registration failed: AxiosError: Request failed with status code 404
A resource is blocked by OpaqueResponseBlocking
```

---

## ⚡ Quick Fixes (Do These Now)

### Step 1: Configure Render Backend (5 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on **visit-vagad-server** service
3. Go to **Settings** tab → **Environment**
4. Find or add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | Generate new | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CORS_ORIGIN` | `https://visitvagad.vercel.app` | **⚠️ CRITICAL** - Must match your Vercel domain |
| `IMAGEKIT_PUBLIC_KEY` | Your key | From ImageKit dashboard |
| `IMAGEKIT_PRIVATE_KEY` | Your key | From ImageKit dashboard |
| `IMAGEKIT_URL_ENDPOINT` | Your endpoint | From ImageKit dashboard |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `NODE_ENV` | `production` | Server environment |
| `PORT` | `5000` | Server port |

5. **Click Save** at the bottom
6. Go to **Deployments** tab
7. Click **Manual Deploy** → **Redeploy Latest Commit**
8. Wait for deployment to complete (green checkmark)

### Step 2: Configure Vercel Frontend (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click on **visitvagad** project
3. Go to **Settings** tab → **Environment Variables**
4. Add or update:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://visitvagad-server.onrender.com` |

5. **Save** the changes
6. The app should auto-redeploy
7. Check deployment logs for any errors

### Step 3: Verify It Works

1. Go to https://visitvagad.vercel.app
2. Open browser console: **F12** → **Console** tab
3. Try to register or login
4. **All errors should be gone** ✅

---

## 🧪 How to Test the Backend Directly

Open your terminal and run:

```bash
# Test if backend is responding
curl https://visitvagad-server.onrender.com/api/places

# Should return JSON data, NOT a 404 error
```

If you get a 404, the backend needs to be redeployed.

---

## ❓ Common Issues

### ❌ Still getting 404 errors after deploying?

**Cause**: CORS_ORIGIN not set correctly on Render

**Fix**:
1. Go to Render Dashboard
2. Settings → Environment Variables
3. Verify `CORS_ORIGIN=https://visitvagad.vercel.app`
4. Save and redeploy

### ❌ Getting CORS error in console?

**Message**: `No 'Access-Control-Allow-Origin' header is present on the requested resource`

**Cause**: Backend CORS not configured for your domain

**Fix**: Same as above - set `CORS_ORIGIN` on Render

### ❌ Images not loading (OpaqueResponseBlocking)?

**Cause**: Image sources need HTTPS and proper CORS headers

**Fix**: Already configured in the code ✅
- Images from Unsplash should work
- Images from ImageKit should work
- If still blocked, check browser console for specific image URL

---

## 📊 Architecture Overview

```
User Browser (https://visitvagad.vercel.app)
    ↓
    → Makes API call to /api/auth/register
    ↓
Vercel (rewrites /api/* → https://visitvagad-server.onrender.com/api/*)
    ↓
Render Backend (https://visitvagad-server.onrender.com)
    ↓
    → Checks CORS: Is origin (visitvagad.vercel.app) allowed?
    ↓ YES (if CORS_ORIGIN is set correctly)
    → Routes to /api/auth/register handler
    ↓
    → Connects to MongoDB Atlas
    ↓
    → Returns JSON response
    ↓
Vercel sends response back to browser
```

---

## 🎯 What Each Environment Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| **CORS_ORIGIN** | Tells backend which frontend domain is allowed | `https://visitvagad.vercel.app` |
| **MONGO_URI** | Database connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| **JWT_SECRET** | Secret key for authentication tokens | Random 32+ characters |
| **VITE_API_URL** | Tells frontend where backend is located | `https://visitvagad-server.onrender.com` |
| **IMAGEKIT_*** | Image upload service credentials | From ImageKit dashboard |

---

## ✅ Verification Checklist

After completing the steps above:

- [ ] Can load homepage without errors
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Can see places/hotels/events data
- [ ] Images load correctly
- [ ] No console errors (F12 → Console)
- [ ] No CORS errors
- [ ] No 404 errors

If all are checked, your deployment is working! 🎉

---

## 📞 Still Not Working?

1. **Check Render logs**: Go to Render Dashboard → visit-vagad-server → Logs
2. **Check Vercel logs**: Go to Vercel Dashboard → visitvagad → Deployments
3. **Check browser console**: F12 → Console (screenshot the error)
4. Make sure you're looking at the latest deployments

