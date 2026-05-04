import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getAllPlacesApi } from "../apis/places.api"
import type { IPlace } from "../types"
import Loader from "../components/common/Loader"
import { toast } from "sonner"

const HomePage = () => {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<IPlace[]>([])
  const [trending, setTrending] = useState<IPlace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          getAllPlacesApi(undefined, undefined, true),
          getAllPlacesApi(undefined, undefined, undefined, true)
        ])
        setFeatured((featuredRes?.data?.data?.places || []).slice(0, 3))
        setTrending((trendingRes?.data?.data?.places || []).slice(0, 6))
      } catch (error) {
        console.error("Error fetching homepage data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleShare = (place: IPlace) => {
    const shareText = `Explore ${place.name} in Vagad! Discover more on Visit Vagad.`
    const shareUrl = `${window.location.origin}/explore` // Should be /place/:id if implemented
    
    if (navigator.share) {
      navigator.share({
        title: `Visit Vagad - ${place.name}`,
        text: shareText,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596422846543-75c6fc18a594?auto=format&fit=crop&q=80&w=2000" 
            alt="Vagad Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="text-primary-container text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              The Modern Chronicler
            </span>
            <h1 className="text-6xl md:text-8xl text-white font-bold leading-tight mb-8 tracking-tight">
              A Journey into <br />
              <span className="text-primary italic">Heritage.</span>
            </h1>
            <p className="text-white/80 text-xl font-plus-jakarta mb-10 leading-relaxed">
              Vagad is a land of hidden architecture, lush landscapes, and deep history. 
              We curate the stories of Banswara and Dungarpur for the sophisticated traveler.
            </p>
            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => navigate("/explore")}
                className="bg-primary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-container transition-all duration-300 shadow-xl shadow-primary/20"
              >
                Start Exploring
              </button>
              <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur text-white border border-white/20 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chronicles */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Selected for you</span>
            <h2 className="text-5xl font-epilogue font-bold text-on-surface">Featured Chronicles</h2>
          </div>
          <button 
            onClick={() => navigate("/explore")}
            className="text-primary font-bold text-sm uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
          >
            View All
          </button>
        </div>

        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featured.map((place) => (
              <div key={place._id} className="group cursor-pointer" onClick={() => navigate("/explore")}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-8 relative">
                  <img 
                    src={`${place.image}?tr=w-800,h-1000,q-auto`} 
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleShare(place); }}
                      className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/40 transition-all"
                    >
                      Share Story
                    </button>
                  </div>
                </div>
                <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">{place.district} • {place.category}</span>
                <h3 className="text-3xl font-epilogue font-bold text-on-surface group-hover:text-primary transition-colors mb-4">{place.name}</h3>
                <p className="text-on-surface/60 line-clamp-2 font-plus-jakarta leading-relaxed">{place.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tonal Shift Section */}
      <section className="bg-on-surface text-surface py-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1">
             <span className="text-primary-container text-xs font-bold tracking-[0.4em] uppercase mb-6 block">The Geography of Spirit</span>
             <h2 className="text-6xl font-epilogue font-bold leading-tight mb-10">
               Where the <span className="italic text-primary-container">Mahi</span> <br /> Meets the Sacred.
             </h2>
             <p className="text-surface/60 text-xl font-plus-jakarta leading-relaxed mb-12">
               From the 100 islands of Banswara to the carved marble of Beneshwar Dham, 
               Vagad is not just a destination; it is a sacred geometry of water and stone.
             </p>
             <button 
               onClick={() => navigate("/explore")}
               className="bg-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-primary-container transition-all"
             >
               Explore the Map
             </button>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-full border border-surface/10 p-8 animate-spin-slow">
               <div className="w-full h-full rounded-full border border-primary/30 p-8">
                  <img 
                    src="https://images.unsplash.com/photo-1590494161729-373657c609df?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover rounded-full shadow-2xl"
                    alt="Vagad Circle"
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Popular now</span>
          <h2 className="text-5xl font-epilogue font-bold text-on-surface">Trending Chronicles</h2>
        </div>

        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trending.map((place) => (
              <div 
                key={place._id} 
                className="flex gap-6 items-center p-4 rounded-3xl hover:bg-surface-container-low transition-all group cursor-pointer"
                onClick={() => navigate("/explore")}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={`${place.image}?tr=w-200,h-200,q-auto`} 
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{place.category}</span>
                  <h4 className="text-xl font-epilogue font-bold text-on-surface group-hover:text-primary transition-colors">{place.name}</h4>
                  <p className="text-on-surface/40 text-sm font-plus-jakarta">In {place.district}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low py-20 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="max-w-md">
            <h3 className="text-3xl font-epilogue font-bold text-primary mb-6">Visit Vagad</h3>
            <p className="text-on-surface/60 font-plus-jakarta leading-relaxed">
              We are the modern chroniclers of Rajasthan's southern heritage. 
              Our mission is to preserve and promote the stories of the Vagad region.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6">Explore</h5>
              <ul className="space-y-4 text-on-surface/50 text-sm">
                <li><button onClick={() => navigate("/explore")} className="hover:text-primary transition-colors">Banswara</button></li>
                <li><button onClick={() => navigate("/explore")} className="hover:text-primary transition-colors">Dungarpur</button></li>
                <li><button onClick={() => navigate("/explore")} className="hover:text-primary transition-colors">All Places</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6">Legacy</h5>
              <ul className="space-y-4 text-on-surface/50 text-sm">
                <li>Heritage</li>
                <li>Culture</li>
                <li>Geography</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6">Connect</h5>
              <ul className="space-y-4 text-on-surface/50 text-sm">
                <li>Instagram</li>
                <li>WhatsApp</li>
                <li>Email</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-on-surface/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/30">
           <span>© 2026 Visit Vagad Chronicles</span>
           <span>Designed for the Modern Traveler</span>
        </div>
      </footer>
    </div>
  )
}

export default HomePage