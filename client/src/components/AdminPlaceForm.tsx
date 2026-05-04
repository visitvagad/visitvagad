import { useState } from "react"
import api from "../apis/axiosInstance"
import { toast } from "sonner"

interface AdminPlaceFormProps {
  initialData?: any
  onSuccess: () => void
  onCancel: () => void
}

const AdminPlaceForm = ({ initialData, onSuccess, onCancel }: AdminPlaceFormProps) => {
  const PUBLISHABLE_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
  }
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    district: initialData?.district || "Banswara",
    category: initialData?.category || "nature",
    image: initialData?.image || "",
    featured: initialData?.featured || false,
    trending: initialData?.trending || false,
    coordinates: {
      latitude: initialData?.coordinates?.latitude || 23.5461,
      longitude: initialData?.coordinates?.longitude || 74.4348
    }
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const authenticator = async () => {
    try {
      const response = await api.get("/images/auth")
      return response.data.data
    } catch (error) {
      throw new Error(`Authentication request failed: ${error}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (initialData?._id) {
        await api.patch(`/places/${initialData._id}`, formData)
      } else {
        await api.post("/places", formData)
      }
      toast.success(initialData ? "Chronicle refined successfully" : "Heritage entry committed")
      onSuccess()
    } catch (error: any) {
      console.error(error)
      const message = error.response?.data?.message || "Failed to save heritage entry"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-xl max-w-4xl mx-auto border border-outline-variant/10">
      <h2 className="text-4xl font-epilogue font-bold mb-10 text-on-surface">
        {initialData ? "Refine Story" : "New Heritage Entry"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 font-plus-jakarta">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">Place Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-surface-container-low rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Maha Sati"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value as any })}
                className="w-full bg-surface-container-low rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Banswara">Banswara</option>
                <option value="Dungarpur">Dungarpur</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-surface-container-low rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="temple">Temple</option>
                <option value="nature">Nature</option>
                <option value="tribal">Tribal</option>
                <option value="waterfall">Waterfall</option>
                <option value="historical">Historical</option>
                <option value="spiritual">Spiritual</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">Narrative Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-surface-container-low rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary outline-none"
            placeholder="Tell the story of this place..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-primary block">Visual Representation</label>
                {formData.image && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                        <img src={`${formData.image}?tr=w-400,h-225,q-auto`} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, image: "" })}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                            ✕
                        </button>
                    </div>
                )}
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(true)
                      try {
                        const auth = await authenticator()
                        const form = new FormData()
                        form.append("file", file)
                        form.append("fileName", file.name)
                        form.append("publicKey", String(import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY))
                        if (auth.signature) form.append("signature", auth.signature)
                        if (auth.token) form.append("token", auth.token)
                        if (auth.expire) form.append("expire", String(auth.expire))
                        form.append("folder", "/visit-vagad/places")

                        const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                          method: "POST",
                          body: form,
                        })
                        const data = await res.json()
                        if (!res.ok) throw new Error(data.message || "Upload failed")
                        setFormData({ ...formData, image: data.url })
                        toast.success("Image captured successfully")
                      } catch (err) {
                        console.error("Upload error", err)
                        toast.error("Image capture failed")
                      } finally {
                        setUploading(false)
                      }
                    }}
                    className="w-full text-sm text-on-surface/50 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>
                {uploading && <p className="text-xs text-primary animate-pulse">Capturing image...</p>}
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            required
                            value={formData.coordinates.latitude}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                coordinates: { ...formData.coordinates, latitude: parseFloat(e.target.value) } 
                            })}
                            className="w-full bg-surface-container-low rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            required
                            value={formData.coordinates.longitude}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                coordinates: { ...formData.coordinates, longitude: parseFloat(e.target.value) } 
                            })}
                            className="w-full bg-surface-container-low rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-8 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-bold text-on-surface/70 group-hover:text-primary transition-colors">FEATURED</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={formData.trending}
                            onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                            className="w-5 h-5 rounded border-secondary text-secondary focus:ring-secondary"
                        />
                        <span className="text-sm font-bold text-on-surface/70 group-hover:text-secondary transition-colors">TRENDING</span>
                    </label>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-6 mt-12 pt-8 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 text-sm font-bold uppercase tracking-widest text-on-surface/50 hover:text-on-surface transition-colors"
          >
            Abandon
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-primary text-white px-10 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-container disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
          >
            {loading ? "Preserving..." : "Commit Entry"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminPlaceForm