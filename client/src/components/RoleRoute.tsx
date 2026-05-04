import { Navigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useAppAuth } from "../context/AuthContext"

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth()
  const { role, isLoading: authLoading } = useAppAuth()

  if (!isLoaded || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isSignedIn || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RoleRoute