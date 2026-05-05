import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelSchema } from '../schemas';
import type { HotelInput } from '../schemas';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { useAppAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';

const HotelForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const { role } = useAppAuth();

  const { 
    register, 
    handleSubmit, 
    control, 
    reset,
    formState: { errors } 
  } = useForm<HotelInput>({
    resolver: zodResolver(hotelSchema) as any,
    defaultValues: {
      amenities: [''],
      rating: 4,
      verified: false,
      status: 'draft'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: "amenities"
  });

  useEffect(() => {
    if (id) {
      api.get(`/hotels/${id}`)
        .then(res => {
          reset(res.data.data);
          setFetching(false);
        })
        .catch(() => {
          toast.error('Failed to load hotel');
          navigate('/admin/hotels');
        });
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: HotelInput, statusOverride?: string) => {
    setLoading(true);
    const finalData = { 
      ...data, 
      status: statusOverride || (role === 'admin' ? 'published' : 'pending_review') 
    };
    try {
      if (id) {
        await api.patch(`/hotels/${id}`, finalData);
        toast.success(`Hotel updated as ${finalData.status}`);
      } else {
        await api.post('/hotels', finalData);
        toast.success(`Hotel created as ${finalData.status}`);
      }
      navigate('/admin/hotels');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <AdminPageHeader 
        title={id ? 'Edit Hotel' : 'Add New Hotel'} 
        description="List premium accommodations and local stays"
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Hotel Name</label>
              <input 
                {...register('name')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. The Vagad Heritage Resort"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <input 
                {...register('category')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Luxury, Budget, Homestay"
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Price Range</label>
              <input 
                {...register('priceRange')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. ₹2,000 - ₹5,000"
              />
              {errors.priceRange && <p className="text-xs text-red-500">{errors.priceRange.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Rating (1-5)</label>
              <input 
                type="number" step="0.1"
                {...register('rating', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              />
              {errors.rating && <p className="text-xs text-red-500">{errors.rating.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Image URL</label>
            <input 
              {...register('image')}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="https://..."
            />
            {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Booking Link (Optional)</label>
            <input 
              {...register('bookingLink')}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="https://booking.com/..."
            />
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Amenities</label>
              <button 
                type="button" 
                onClick={() => append('')}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Amenity
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input 
                    {...register(`amenities.${index}` as any)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    placeholder="e.g. Free WiFi"
                  />
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              {...register('verified')}
              id="verified"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="verified" className="text-sm font-medium text-gray-700">Mark as Verified Partner</label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/hotels')}
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
            {loading ? 'Saving...' : role === 'admin' ? 'Publish Hotel' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
