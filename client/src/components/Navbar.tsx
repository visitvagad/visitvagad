import { Link } from "react-router-dom"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { useAppAuth } from "../context/AuthContext"

const Navbar = () => {
  const { role } = useAppAuth()

  const isAdminOrEditor = role === "admin" || role === "editor"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="text-primary font-epilogue font-bold text-2xl tracking-tight">
        Visit Vagad
      </Link>

      <div className="flex gap-8 items-center font-plus-jakarta text-sm font-bold tracking-wide">
        <Link to="/explore" className="text-on-surface/70 hover:text-primary transition-colors">
          EXPLORE
        </Link>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-on-surface/70 hover:text-primary cursor-pointer uppercase tracking-widest">
              Login
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link to="/dashboard" className="text-on-surface/70 hover:text-primary transition-colors">
            ITINERARY
          </Link>
          {isAdminOrEditor && (
            <Link to="/admin" className="text-on-surface/70 hover:text-primary transition-colors">
              ADMIN
            </Link>
          )}
          <div className="pl-2">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-primary/20" } }} />
          </div>
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar