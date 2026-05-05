import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { itinerarySchema } from '../schemas';
import type { ItineraryInput } from '../schemas';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { useAppAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

const ItineraryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [destinations, setDestinations] = useState<any[]>([]);

  const { role } = useAppAuth();

  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors } 
  } = useForm<ItineraryInput>({
    resolver: zodResolver(itinerarySchema) as any,
    defaultValues: {
      days: [{ dayNumber: 1, activities: [''], destinations: [] }],
      featured: false,
      status: 'draft'
    }
  });

  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({
    control: control as any,
    name: "days"
  });

  useEffect(() => {
    // Fetch destinations for the dropdown
    api.get('/places').then(res => setDestinations(res.data.data)).catch(() => {});

    if (id) {
      api.get(`/itineraries/${id}`)
        .then(res => {
          reset(res.data.data);
          setFetching(false);
        })
        .catch(() => {
          toast.error('Failed to load itinerary');
          navigate('/admin/itineraries');
        });
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: ItineraryInput, statusOverride?: string) => {
    setLoading(true);
    const finalData = { 
      ...data, 
      status: statusOverride || (role === 'admin' ? 'published' : 'pending_review') 
    };
    try {
      if (id) {
        await api.patch(`/itineraries/${id}`, finalData);
        toast.success(`Itinerary updated as ${finalData.status}`);
      } else {
        await api.post('/itineraries', finalData);
        toast.success(`Itinerary created as ${finalData.status}`);
      }
      navigate('/admin/itineraries');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save itinerary');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <AdminPageHeader 
        title={id ? 'Refine Itinerary' : 'Build New Experience'} 
        description="Craft unforgettable journeys through the heart of Vagad"
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Itinerary Title</label>
            <input 
              {...register('title')}
              className="w-full text-lg font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. 3 Days Tribal Heritage Tour"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Brief Overview</label>
            <textarea 
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="What makes this journey special?"
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              {...register('featured')}
              id="featured"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Feature this itinerary on the homepage</label>
          </div>
        </div>

        {/* Dynamic Days */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <span>Journey Timeline</span>
            </h3>
            <button 
              type="button" 
              onClick={() => appendDay({ dayNumber: dayFields.length + 1, activities: [''], destinations: [] })}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Another Day
            </button>
          </div>

          <div className="space-y-8">
            {dayFields.map((field, index) => (
              <div key={field.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-bold text-gray-700">Day {index + 1}</h4>
                  {dayFields.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeDay(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="p-6 space-y-6">
                  {/* Activities */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Key Activities</label>
                    <textarea 
                      {...register(`days.${index}.activities.0` as any)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                      placeholder="e.g. Morning boat ride, Temple visit..."
                      rows={2}
                    />
                  </div>

                  {/* Destinations Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      <MapPin size={12} /> Linked Destinations
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      {destinations.map(dest => (
                        <label key={dest._id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 text-xs cursor-pointer hover:border-primary transition-colors">
                          <input 
                            type="checkbox"
                            value={dest._id}
                            {...register(`days.${index}.destinations` as any)}
                            className="w-3 h-3 rounded text-primary focus:ring-primary"
                          />
                          <span>{dest.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/itineraries')}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          {role === 'editor' && (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
              className="px-6 py-2 bg-white border border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              Save as Draft
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {loading ? 'Preserving...' : role === 'admin' ? 'Publish Itinerary' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;
