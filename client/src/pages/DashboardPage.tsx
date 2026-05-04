import { useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import api from "../apis/axiosInstance"
import Loader from "../components/common/Loader"

const DashboardPage = () => {
  const { user } = useUser()
  const [itineraries, setItineraries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Placeholder for itinerary fetching logic
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-2 block">
            Welcome back, {user?.firstName || 'Traveler'}
          </span>
          <h1 className="text-5xl font-epilogue font-bold text-on-surface">
            Your Personal Chronicles
          </h1>
        </header>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center space-y-4 aspect-square">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary text-3xl font-light">
                +
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">New Itinerary</h3>
                <p className="text-on-surface/40 text-sm">Plan your next journey through Vagad.</p>
              </div>
            </div>

            {/* Empty State for Itineraries */}
            {itineraries.length === 0 && (
              <div className="lg:col-span-2 bg-surface-container-low/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6">
                <p className="text-on-surface/50 font-plus-jakarta italic text-lg max-w-md">
                  "The world is a book and those who do not travel read only one page."
                </p>
                <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                  Explore Destinations
                </button>
              </div>
            )}
          </div>
        )}

        <section className="mt-20">
            <h2 className="text-2xl font-epilogue font-bold text-on-surface mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-50">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[4/5] bg-surface-container-low rounded-2xl animate-pulse"></div>
                ))}
            </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage