import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { toast } from 'sonner';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';

interface Itinerary {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  duration: number;
  days: any[];
  featured: boolean;
  status: 'draft' | 'pending_review' | 'published';
}

const ItinerariesPage: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      const res = await api.get('/itineraries');
      // The backend returns { itineraries, total, ... }
      setItineraries(res.data.data.itineraries || []);
    } catch (error) {
      toast.error('Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      await api.delete(`/itineraries/${id}`);
      toast.success('Itinerary deleted');
      setItineraries(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      toast.error('Failed to delete itinerary');
    }
  };

  const filteredItineraries = itineraries.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <AdminPageHeader
          title="Itineraries"
          description="Design and manage curated travel experiences for Vagad's visitors."
        />
        <button
          onClick={() => navigate('/admin/itineraries/new')}
          className="group relative bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          <span>Build Journey</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface-container-lowest p-4 rounded-[32px] border border-outline-variant/10 shadow-sm">
        <div className="flex-1 relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search itineraries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-surface-container-low animate-pulse rounded-[40px] border border-outline-variant/10"></div>
          ))}
        </div>
      ) : filteredItineraries.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-on-surface/20 space-y-6 bg-surface-container-lowest rounded-[48px] border-2 border-dashed border-outline-variant/20">
          <div className="p-8 bg-surface-container-low rounded-full">
            <MapPin size={64} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-on-surface/40">No Journeys Found</h3>
            <p className="text-sm">Start by building your first travel itinerary.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItineraries.map((itinerary) => (
            <div key={itinerary._id} className="group relative bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 overflow-hidden hover:shadow-2xl hover:shadow-on-surface/5 transition-all duration-500 flex flex-col h-full">
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={itinerary.coverImage || 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Vagad+Journey'}
                  alt={itinerary.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-2 shadow-xl border border-white/20 ${itinerary.status === 'published' ? 'bg-green-500/80 text-white' :
                      itinerary.status === 'pending_review' ? 'bg-amber-500/80 text-white' :
                        'bg-white/80 text-on-surface'
                    }`}>
                    {itinerary.status === 'published' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {itinerary.status.replace('_', ' ')}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-6 left-6">
                  <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20 flex items-center gap-2">
                    <Clock size={12} />
                    {itinerary.days?.length || 0} Days
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Itinerary</span>
                  </div>
                  <h3 className="text-xl font-epilogue font-bold text-on-surface leading-tight line-clamp-2">
                    {itinerary.title}
                  </h3>
                  <p className="text-sm text-on-surface/60 line-clamp-2 leading-relaxed">
                    {itinerary.description || 'Discover the hidden gems and cultural heritage of the Vagad region through this curated journey.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-low flex items-center justify-center text-[10px] font-bold text-on-surface/40">
                        D{i}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      +{itinerary.days?.length > 3 ? itinerary.days.length - 3 : 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/itineraries/edit/${itinerary._id}`)}
                      className="p-3 hover:bg-primary/10 text-on-surface/40 hover:text-primary rounded-2xl transition-all"
                      title="Edit Journey"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(itinerary._id, itinerary.title)}
                      className="p-3 hover:bg-red-50 text-on-surface/40 hover:text-red-600 rounded-2xl transition-all"
                      title="Delete Journey"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItinerariesPage;
