import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { eventSchema } from '../schemas';
import type { EventInput } from '../schemas';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { useAppAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const EventForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const { role } = useAppAuth();

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      recurring: false,
      status: 'draft'
    }
  });

  useEffect(() => {
    if (id) {
      api.get(`/events/${id}`)
        .then(res => {
          reset(res.data.data);
          setFetching(false);
        })
        .catch(() => {
          toast.error('Failed to load event');
          navigate('/admin/events');
        });
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: EventInput, statusOverride?: string) => {
    setLoading(true);
    const finalData = { 
      ...data, 
      status: statusOverride || (role === 'admin' ? 'published' : 'pending_review') 
    };
    try {
      if (id) {
        await api.patch(`/events/${id}`, finalData);
        toast.success(`Event updated as ${finalData.status}`);
      } else {
        await api.post('/events', finalData);
        toast.success(`Event created as ${finalData.status}`);
      }
      navigate('/admin/events');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <AdminPageHeader 
        title={id ? 'Edit Event' : 'Add New Event'} 
        description="Share Vagad's vibrant culture with the world"
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Event Name</label>
              <input 
                {...register('name')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Baneshwar Fair"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Date/Schedule</label>
              <input 
                {...register('date')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Feb 12 - Feb 16"
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <input 
              {...register('location')}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Baneshwar Temple Ground"
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="General information about the event"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cultural Significance</label>
            <textarea 
              {...register('culturalSignificance')}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Why is this event important?"
            />
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

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              {...register('recurring')}
              id="recurring"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">Recurring Annual Event</label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
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
            {loading ? 'Saving...' : role === 'admin' ? 'Publish Event' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
