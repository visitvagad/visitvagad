# VisitVagad - Tourism Web Application

VisitVagad is a premium tourism web application dedicated to showcasing the sun-drenched heritage of the Vagad region (Banswara and Dungarpur) in Rajasthan.

## 🌟 Features

- **Editorial UI:** High-end magazine feel with intentional asymmetry and tonal depth.
- **Authentication:** Secure user management powered by Clerk.
- **RBAC System:** Distinct roles for Admin, Editor, and User.
- **Curated Exploration:** Filterable grid of historical and natural sites.
- **Admin Panel:** Comprehensive tools for managing places and user roles.
- **Optimized Visuals:** Direct-to-ImageKit uploads with real-time transformations.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS (v4), Clerk SDK.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Clerk Node SDK.
- **Images:** ImageKit.io.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Clerk account
- ImageKit account

### 2. Environment Setup
Create `.env` files in both `client` and `server` directories based on the `.env.example` files provided.

### 3. Installation
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 4. Running the Application
```bash
# Start backend (from server folder)
npm run dev

# Start frontend (from client folder)
npm run dev
```

## 📄 Documentation
- [Server Documentation](./server/README.md)
- [Client Documentation](./client/README.md)
- [Design System](./DESIGN.md)
