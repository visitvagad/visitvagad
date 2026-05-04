import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <Navigate 
        to="/" 
        state={{ from: location }} 
        replace 
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute