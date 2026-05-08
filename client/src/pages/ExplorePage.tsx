import { useState, useEffect } from "react"
import { getAllPlacesApi } from "../apis/places.api"
import type { IPlace } from "../types"
import Loader from "../components/common/Loader"
import { toast } from "sonner"

const ExplorePage = () => {
  const [places, setPlaces] = useState<IPlace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({ district: "", category: "" })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const fetchPlaces = async (pageNum: number = 1) => {
    setIsLoading(true)
    try {
      const res = await getAllPlacesApi(filter.district, filter.category, undefined, undefined, pageNum)
      const data = res?.data?.data
      setPlaces(data?.places || [])
      setPagination({
        page: data?.page || pageNum,
        pages: data?.pages || 1,
        total: data?.total || 0
      })
    } catch (error) {
      console.error("Error fetching places:", error)
      toast.error("Failed to load heritage sites")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaces(1)
  }, [filter])

  const categories = ["temple", "nature", "tribal", "waterfall", "historical", "spiritual"]
  const districts = ["Banswara", "Dungarpur"]

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-2 block">
            Discover the Hidden
          </span>
          <h1 className="text-5xl font-epilogue font-bold text-on-surface mb-6">
            Curated Experiences
          </h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-8">
            <select 
              className="bg-surface-container-low border-none rounded-full px-6 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              value={filter.district}
              onChange={(e) => setFilter({ ...filter, district: e.target.value })}
            >
              <option value="">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter({ ...filter, category: "" })}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${!filter.category ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface/60 hover:bg-surface-container-highest'}`}
              >
                All
              </button>
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setFilter({ ...filter, category: c })}
                  className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${filter.category === c ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface/60 hover:bg-surface-container-highest'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </header>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {places.map((place) => (
                <div key={place._id} className="group cursor-pointer">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-surface-container shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img 
                      src={`${place.image}?tr=w-600,h-800,q-auto,f-auto`} 
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
                        {place.category} • {place.district}
                      </span>
                      {place.featured && (
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-epilogue font-bold text-on-surface group-hover:text-primary transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-on-surface/60 text-sm line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchPlaces(pagination.page - 1)}
                  className="px-6 py-2 rounded-full border border-outline-variant/30 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary disabled:opacity-20 transition-all"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-on-surface/40">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchPlaces(pagination.page + 1)}
                  className="px-6 py-2 rounded-full border border-outline-variant/30 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary disabled:opacity-20 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && places.length === 0 && (
          <div className="text-center py-24">
            <p className="text-on-surface/40 text-lg">No places found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplorePage