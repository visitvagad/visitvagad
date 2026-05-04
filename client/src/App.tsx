import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, lazy, Suspense } from "react"
import { useAuth } from "@clerk/clerk-react"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"
import Loader from "./components/common/Loader"
import { setAuthToken } from "./apis/axiosInstance"

const ExplorePage = lazy(() => import("./pages/ExplorePage"))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))

const TokenSync = () => {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    const syncToken = async () => {
      if (isSignedIn) {
        const token = await getToken()
        setAuthToken(token)
      } else {
        setAuthToken(null)
      }
    }
    syncToken()
  }, [isSignedIn, getToken])

  return null
}

const App = () => {
  return (
    <BrowserRouter>
      <TokenSync />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <RoleRoute allowedRoles={["admin", "editor"]}>
              <AdminDashboard />
            </RoleRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App