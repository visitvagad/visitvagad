import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationSchema } from '../schemas';
import type { DestinationInput } from '../schemas';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { useAppAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';

const DestinationForm: React.FC = () => {
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
  } = useForm<DestinationInput>({
    resolver: zodResolver(destinationSchema) as any,
    defaultValues: {
      highlights: [''],
      images: [''],
      district: 'Banswara',
      featured: false,
      location: { lat: 23.5461, lng: 74.4348 },
      status: 'draft'
    }
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control: control as any,
    name: "highlights"
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: control as any,
    name: "images"
  });

  useEffect(() => {
    if (id) {
      api.get(`/places/${id}`)
        .then(res => {
          reset(res.data.data);
          setFetching(false);
        })
        .catch(() => {
          toast.error('Failed to load destination');
          navigate('/admin/destinations');
        });
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: DestinationInput, statusOverride?: string) => {
    setLoading(true);
    const finalData = { 
      ...data, 
      status: statusOverride || (role === 'admin' ? 'published' : 'pending_review') 
    };
    try {
      if (id) {
        await api.patch(`/places/${id}`, finalData);
        toast.success(`Destination updated as ${finalData.status}`);
      } else {
        await api.post('/places', finalData);
        toast.success(`Destination created as ${finalData.status}`);
      }
      navigate('/admin/destinations');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save destination');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <AdminPageHeader 
        title={id ? 'Edit Destination' : 'Add New Destination'} 
        description="Fill in the details to showcase Vagad's beauty"
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <input 
                {...register('name')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Mahi Bajaj Sagar Dam"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Slug</label>
              <input 
                {...register('slug')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. mahi-dam"
              />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">District</label>
              <select 
                {...register('district')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="Banswara">Banswara</option>
                <option value="Dungarpur">Dungarpur</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Type</label>
              <input 
                {...register('type')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Nature, Temple"
              />
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Best Time to Visit</label>
              <input 
                {...register('bestTime')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. July to March"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Short Description</label>
            <textarea 
              {...register('shortDescription')}
              rows={2}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Brief summary for cards"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Narrative</label>
            <textarea 
              {...register('description')}
              rows={5}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Detailed story and information"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Latitude</label>
              <input 
                type="number" step="any"
                {...register('location.lat', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Longitude</label>
              <input 
                type="number" step="any"
                {...register('location.lng', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Highlights</label>
              <button 
                type="button" 
                onClick={() => appendHighlight('')}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Highlight
              </button>
            </div>
            <div className="space-y-3">
              {highlightFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input 
                    {...register(`highlights.${index}` as any)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    placeholder="Key feature..."
                  />
                  <button 
                    type="button" 
                    onClick={() => removeHighlight(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Image URLs</label>
              <button 
                type="button" 
                onClick={() => appendImage('')}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Image
              </button>
            </div>
            <div className="space-y-3">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input 
                    {...register(`images.${index}` as any)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    placeholder="https://..."
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
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
              {...register('featured')}
              id="featured"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Destination</label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/destinations')}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
            {loading ? 'Saving...' : role === 'admin' ? 'Publish Destination' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
