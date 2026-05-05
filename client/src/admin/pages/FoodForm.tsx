import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { foodSchema } from '../schemas';
import type { FoodInput } from '../schemas';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { useAppAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const FoodForm: React.FC = () => {
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
  } = useForm<FoodInput>({
    resolver: zodResolver(foodSchema) as any,
    defaultValues: {
        status: 'draft'
    }
  });

  useEffect(() => {
    if (id) {
      api.get(`/food/${id}`)
        .then(res => {
          reset(res.data.data);
          setFetching(false);
        })
        .catch(() => {
          toast.error('Failed to load food item');
          navigate('/admin/food');
        });
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: FoodInput, statusOverride?: string) => {
    setLoading(true);
    const finalData = { 
      ...data, 
      status: statusOverride || (role === 'admin' ? 'published' : 'pending_review') 
    };
    try {
      if (id) {
        await api.patch(`/food/${id}`, finalData);
        toast.success(`Food item updated as ${finalData.status}`);
      } else {
        await api.post('/food', finalData);
        toast.success(`Food item created as ${finalData.status}`);
      }
      navigate('/admin/food');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save food item');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <AdminPageHeader 
        title={id ? 'Edit Food Item' : 'Add New Food Item'} 
        description="Detail the culinary delights of Vagad"
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Food Name</label>
              <input 
                {...register('name')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Dal Baati Churma"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <input 
                {...register('category')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Traditional, Street Food"
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Tell the story and taste of this dish"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
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
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/food')}
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
            {loading ? 'Saving...' : role === 'admin' ? 'Publish Food Item' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
