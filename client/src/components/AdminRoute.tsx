import { Navigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import api from "../apis/axiosInstance"

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      if (isSignedIn) {
        try {
          const res = await api.get("/auth/me")
          const userData = res?.data?.data
          setIsAdmin(userData?.role === "admin")
        } catch (error) {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }
    
    if (isLoaded) {
      checkAdmin()
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded || isAdmin === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute