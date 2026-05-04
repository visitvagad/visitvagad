# 🚀 Deployment Guide - Render & Vercel

यह गाइड आपको VisitVagad को **Render** (Backend) और **Vercel** (Frontend) पर deploy करने में मदद करेगी।

---

## 📋 Deployment Overview

| Component | Platform | Details |
|-----------|----------|---------|
| **Frontend** | Vercel | React + Vite (Static Build) |
| **Backend** | Render | Node.js + Express + MongoDB |
| **Database** | MongoDB Atlas | Cloud Database |

---

## 🔧 Prerequisites (सभी में करने से पहले)

1. **GitHub Account** - Code को push करें
2. **MongoDB Atlas** - Free cluster बनाएं
3. **Clerk Account** - Authentication के लिए
4. **ImageKit Account** - Image uploads के लिए
5. **Render Account** - Backend deploy करने के लिए
6. **Vercel Account** - Frontend deploy करने के लिए

---

## 📦 Step 1: GitHub पर Code Upload करें

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/visit-vagad.git
git push -u origin main
```

---

## 🗄️ Step 2: MongoDB Atlas Setup

### 2.1 Database बनाएं
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) पर जाएं
2. **Create a Cluster** → Free (M0) चुनें
3. Database name: `visitvagad`
4. Collection बनाएं: `users`, `places`, `itineraries`

### 2.2 Connection String प्राप्त करें
1. **Connect** बटन पर क्लिक करें
2. **Drivers** चुनें
3. Connection string कॉपी करें:
```
mongodb+srv://username:password@cluster.mongodb.net/visitvagad?retryWrites=true&w=majority
```

### 2.3 IP Whitelist करें
- Network Access → Add IP Address
- `0.0.0.0/0` (सभी IPs को allow करें)

---

## 🔐 Step 3: Environment Variables तैयार करें

### Server के लिए (.env)
```env
# Production के लिए
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/visitvagad
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
CLERK_PUBLISHABLE_KEY=pk_live_your_key
CLERK_SECRET_KEY=sk_live_your_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

### Client के लिए (.env.local)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🖥️ Step 4: Render पर Backend Deploy करें

### 4.1 Render पर नई Web Service बनाएं
1. [Render.com](https://render.com) पर लॉगिन करें
2. **New +** → **Web Service** क्लिक करें
3. अपना GitHub repository कनेक्ट करें
4. Configuration:
   - **Name**: `visit-vagad-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18.0.0` (या उससे ऊपर)

### 4.2 Environment Variables जोड़ें
Render में Environment tab में ये variables जोड़ें:

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/visitvagad
JWT_SECRET = your_jwt_secret_key
JWT_EXPIRES_IN = 7d
CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY = sk_live_...
IMAGEKIT_PUBLIC_KEY = ...
IMAGEKIT_PRIVATE_KEY = ...
IMAGEKIT_URL_ENDPOINT = https://ik.imagekit.io/...
CORS_ORIGIN = https://your-frontend-domain.vercel.app
PORT = 5000
```

### 4.3 Deploy करें
- Deploy बटन दबाएं
- Logs देखें
- Deploy URL नोट करें (जैसे: `https://visit-vagad-server.onrender.com`)

---

## 🎨 Step 5: Vercel पर Frontend Deploy करें

### 5.1 Vercel से कनेक्ट करें
1. [Vercel.com](https://vercel.com) पर लॉगिन करें
2. **Add New** → **Project**
3. अपना GitHub repository import करें

### 5.2 Build Settings
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: client/dist
Install Command: npm install
```

### 5.3 Environment Variables जोड़ें
Vercel Project Settings → Environment Variables में:

```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_...
VITE_API_URL = https://your-backend-name.onrender.com
```

### 5.4 Deploy करें
- Vercel automatically देखेगा और deploy करेगा
- Production URL प्राप्त करें

---

## 🔄 Step 6: Backend के CORS Origin को Update करें

Backend deploy होने के बाद:

1. Render में Environment Variables edit करें
2. `CORS_ORIGIN` को अपने Vercel frontend URL से update करें:
   ```
   CORS_ORIGIN = https://your-domain.vercel.app
   ```
3. Changes save करें (auto redeploy होगा)

---

## ✅ Step 7: Testing & Verification

### Frontend Test करें
1. Vercel URL खोलें
2. यह सुनिश्चित करें कि:
   - ✅ Pages load हों
   - ✅ Login/Register काम करे
   - ✅ Places देख सकें
   - ✅ Images upload हो सकें

### Backend Test करें
```bash
# API को test करें
curl https://your-backend.onrender.com/api/health

# या Postman में test करें
GET https://your-backend.onrender.com/api/places
```

---

## 🛠️ Troubleshooting

### 1. CORS Error मिल रहा है?
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Backend के `CORS_ORIGIN` को frontend URL से match करें।

### 2. MongoDB Connection Error?
```
MongooseError: Cannot connect to MongoDB
```
**Solution**:
- IP Whitelist check करें (`0.0.0.0/0` add करें)
- Connection string सही है यह verify करें
- Username/password में special characters हैं तो URL encode करें

### 3. Image Upload काम नहीं कर रहा?
```
ImageKit Error: Invalid credentials
```
**Solution**:
- ImageKit keys सही हैं यह verify करें
- URL endpoint सही format में है: `https://ik.imagekit.io/YOUR_ID`

### 4. Build करते समय error?
```
Build failed
```
**Solution**:
- Local में `npm run build` run करके check करें
- सभी dependencies installed हैं यह verify करें

---

## 📝 Additional Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Clerk Documentation](https://clerk.com/docs)

---

## 🎯 Deployment Checklist

- [ ] GitHub repository ready है
- [ ] MongoDB Atlas cluster बना दी है
- [ ] Clerk keys प्राप्त कर लिए हैं
- [ ] ImageKit account setup है
- [ ] .env.example files फिर से check किए हैं
- [ ] Backend Render पर deploy हो गया है
- [ ] Frontend Vercel पर deploy हो गया है
- [ ] CORS_ORIGIN update किया है
- [ ] सभी features test किए हैं
- [ ] Domain custom हैं (optional)

---

**Happy Deploying! 🎉**
