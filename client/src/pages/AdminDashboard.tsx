import { useState, useEffect } from "react"
import api from "../apis/axiosInstance"
import type { IPlace, IUser } from "../types"
import AdminPlaceForm from "../components/AdminPlaceForm"
import Loader from "../components/common/Loader"
import StatsCard from "../components/common/StatsCard"
import Pagination from "../components/common/Pagination"
import { getAllUsersApi, updateUserRoleApi } from "../apis/auth.api"
import { getStatsApi, deletePlaceApi, updatePlaceApi } from "../apis/places.api"
import { toast } from "sonner"

interface DashboardStats {
  totalPlaces: number
  featuredPlaces: number
  trendingPlaces: number
  totalUsers: number
}

const AdminDashboard = () => {
  const [places, setPlaces] = useState<IPlace[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"places" | "users">("places")
  const [showForm, setShowForm] = useState(false)
  const [editingPlace, setEditingPlace] = useState<IPlace | null>(null)
  
  // Pagination & Filters
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDistrict, setFilterDistrict] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  const fetchStats = async () => {
    try {
      const res = await getStatsApi()
      setStats(res?.data?.data || null)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === "places") {
        const res = await api.get("/places", {
          params: {
            page,
            limit: 10,
            district: filterDistrict || undefined,
            category: filterCategory || undefined,
            search: searchTerm || undefined // Note: backend search needs to be implemented or filter client-side
          }
        })
        const data = res?.data?.data
        setPlaces(data?.places || [])
        setTotalPages(data?.pages || 1)
      } else {
        const res = await getAllUsersApi()
        const data = res?.data?.data
        setUsers(data?.users || [])
        setTotalPages(data?.pages || 1)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchData()
  }, [activeTab, page, filterDistrict, filterCategory])

  const handleDeletePlace = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this story from the records?")) {
      try {
        await deletePlaceApi(id)
        setPlaces(places.filter((p) => p._id !== id))
        toast.success("Chronicle purged from history")
        fetchStats()
      } catch (error) {
        toast.error("Purge failed")
      }
    }
  }

  const handleToggleStatus = async (place: IPlace, field: 'featured' | 'trending') => {
    try {
      const newValue = !place[field]
      await updatePlaceApi(place._id, { [field]: newValue })
      setPlaces(places.map(p => p._id === place._id ? { ...p, [field]: newValue } : p))
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} status updated`)
      fetchStats()
    } catch (error) {
      toast.error("Update failed")
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRoleApi(userId, newRole)
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u))
      toast.success("Authority reassigned successfully")
    } catch (error) {
      toast.error("Reassignment failed")
    }
  }

  const handleEditPlace = (place: IPlace) => {
    setEditingPlace(place)
    setShowForm(true)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditingPlace(null)
    fetchData()
    fetchStats()
  }

  // Client-side search for simplicity if backend search isn't robust
  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12 px-6 font-plus-jakarta">
      <div className="max-w-7xl mx-auto">
        {showForm ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminPlaceForm
              initialData={editingPlace}
              onSuccess={handleSuccess}
              onCancel={() => { setShowForm(false); setEditingPlace(null); }}
            />
          </div>
        ) : (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-2 block">
                  Archive Management
                </span>
                <h1 className="text-5xl font-epilogue font-bold text-on-surface">
                  Vagad Chronicles
                </h1>
                
                <div className="flex gap-8 mt-8 border-b border-outline-variant/10">
                  <button 
                    onClick={() => { setActiveTab("places"); setPage(1); }}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "places" ? "text-primary border-b-2 border-primary" : "text-on-surface/40 hover:text-on-surface"}`}
                  >
                    Places
                  </button>
                  <button 
                    onClick={() => { setActiveTab("users"); setPage(1); }}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "users" ? "text-primary border-b-2 border-primary" : "text-on-surface/40 hover:text-on-surface"}`}
                  >
                    Users
                  </button>
                </div>
              </div>
              
              {activeTab === "places" && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
                >
                  Add New Heritage
                </button>
              )}
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatsCard 
                title="Total Heritage" 
                value={stats?.totalPlaces || 0} 
                description="Preserved stories"
              />
              <StatsCard 
                title="Featured" 
                value={stats?.featuredPlaces || 0} 
                description="Spotlight chronicles"
              />
              <StatsCard 
                title="Trending" 
                value={stats?.trendingPlaces || 0} 
                description="Active explorations"
              />
              <StatsCard 
                title="Guardians" 
                value={stats?.totalUsers || 0} 
                description="Registered explorers"
              />
            </div>

            {/* Filters Bar */}
            {activeTab === "places" && (
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[200px]">
                  <input 
                    type="text" 
                    placeholder="Search archives..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <select 
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-5 py-3 text-sm outline-none"
                >
                  <option value="">All Districts</option>
                  <option value="Banswara">Banswara</option>
                  <option value="Dungarpur">Dungarpur</option>
                </select>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-5 py-3 text-sm outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="temple">Temple</option>
                  <option value="nature">Nature</option>
                  <option value="tribal">Tribal</option>
                  <option value="waterfall">Waterfall</option>
                  <option value="historical">Historical</option>
                  <option value="spiritual">Spiritual</option>
                </select>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : activeTab === "places" ? (
              <>
                <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-surface-container-low border-b border-outline-variant/10">
                        <tr>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">Place</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">District</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">Category</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">Flags</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {filteredPlaces.map((place) => (
                          <tr key={place._id} className="hover:bg-surface-container-low/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <img src={`${place.image}?tr=w-100,h-100,q-auto`} className="w-12 h-12 rounded-lg object-cover bg-surface-container-high" alt="" />
                                <span className="font-bold text-on-surface group-hover:text-primary transition-colors">{place.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-on-surface/70">{place.district}</td>
                            <td className="px-8 py-6 capitalize text-on-surface/70">{place.category}</td>
                            <td className="px-8 py-6">
                              <div className="flex gap-4">
                                <button 
                                  onClick={() => handleToggleStatus(place, 'featured')}
                                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-all ${place.featured ? 'bg-primary/10 text-primary' : 'bg-on-surface/5 text-on-surface/20'}`}
                                >
                                  Featured
                                </button>
                                <button 
                                  onClick={() => handleToggleStatus(place, 'trending')}
                                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-all ${place.trending ? 'bg-secondary/10 text-secondary' : 'bg-on-surface/5 text-on-surface/20'}`}
                                >
                                  Trending
                                </button>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-6">
                                <button 
                                  onClick={() => handleEditPlace(place)}
                                  className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-container"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeletePlace(place._id)}
                                  className="text-xs font-bold uppercase tracking-widest text-on-surface/30 hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredPlaces.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-8 py-12 text-center text-on-surface/30 font-bold uppercase tracking-widest">
                              No chronicles found in this sector
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            ) : (
              <>
                <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-surface-container-low border-b border-outline-variant/10">
                        <tr>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">Guardian</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">Contact</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50">Current Role</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface/50 text-right">Assign Authority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                            <td className="px-8 py-6 font-bold text-on-surface">{user.name || "Anonymous Explorer"}</td>
                            <td className="px-8 py-6 text-on-surface/70">{user.email}</td>
                            <td className="px-8 py-6">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${user.role === 'admin' ? 'bg-primary/10 text-primary' : user.role === 'editor' ? 'bg-secondary/10 text-secondary' : 'bg-on-surface/5 text-on-surface/40'}`}>
                                {user.role || 'user'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2">
                                {["user", "editor", "admin"].map(r => (
                                  <button
                                    key={r}
                                    onClick={() => handleUpdateRole(user.id, r)}
                                    disabled={user.role === r}
                                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${user.role === r ? 'bg-on-surface/5 text-on-surface/20 border-transparent' : 'border-outline-variant/30 text-on-surface/40 hover:border-primary hover:text-primary'}`}
                                  >
                                    {r.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-on-surface/30 font-bold uppercase tracking-widest">
                              No guardians registered
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard