# Render Deployment - Build Fix

## Problem
Render deployment fails with: `Cannot find module 'express'` and other dependency errors.

**Reason**: Dependencies aren't being installed before the build command runs.

---

## ✅ Solution - Update Render Dashboard Build Command

### Step 1: Go to Render Dashboard
1. Open [https://dashboard.render.com](https://dashboard.render.com)
2. Select your **visit-vagad-server** service

### Step 2: Update Build Command
1. Navigate to **Settings** tab
2. Find **Build Command** field
3. **Replace** the current command with:
```bash
npm install --legacy-peer-deps && npm run build
```

4. Click **Save**

### Step 3: Redeploy
1. Go to **Logs** or **Deployments** tab
2. Click **Manual Deploy** or **Redeploy latest commit**
3. Wait for build to complete

---

## Build Command Explanation

```bash
npm install --legacy-peer-deps && npm run build
```

- `npm install --legacy-peer-deps` → Installs all dependencies (ignores some peer dependency warnings)
- `&&` → Runs next command only if install succeeds
- `npm run build` → Compiles TypeScript to JavaScript

---

## Expected Output
When it works, you should see:
```
> server@1.0.0 build
> tsc

✅ Successfully compiled!
```

---

## Common Issues

### Still seeing errors?
1. **Clear Render cache**: Settings → Clear build cache → Redeploy
2. **Check Node version**: Should be 18+ (current: 24.14.1 ✅)
3. **Verify .env variables**: All required env vars must be set in Render dashboard

### Error: `peer dependencies not installed`
- Already handled with `--legacy-peer-deps` flag

### Error: `MONGO_URI not set`
- Check Render Environment Variables are properly configured
- Ensure MongoDB Atlas connection string is correct

---

## Files Updated
- ✅ `render.yaml` - Updated with correct build command
- ✅ `tsconfig.json` - Fixed TypeScript configuration
- ✅ Removed `.ts` extensions from imports

All changes are committed and ready for deployment!
