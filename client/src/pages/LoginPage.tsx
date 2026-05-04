import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

interface LoginFormData {
    email: string
    password: string
}

function LoginPage() {

    const authContext = useContext(AuthContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("")
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            setError("Email is required")
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email")
            return false
        }
        if (!formData.password) {
            setError("Password is required")
            return false
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        if (!authContext || !authContext.login) {
            setError("Auth service unavailable")
            return
        }

        try {
            setLoading(true)
            setError("")

            await authContext.login(formData.email, formData.password)

            navigate("/")

        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Login failed. Please try again."
            setError(errorMessage)
            console.error("Login failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4">

            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-md p-8">

                    <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Login to Visit Vagad
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                disabled={loading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                disabled={loading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                                Register here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default LoginPage