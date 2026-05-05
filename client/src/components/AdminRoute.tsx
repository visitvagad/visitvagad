import { Navigate } from "react-router-dom"
import { useAppAuth } from "../context/AuthContext"

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isSignedIn, role } = useAppAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isSignedIn || role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute