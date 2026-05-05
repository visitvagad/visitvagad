import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminTable from '../components/AdminTable';
import api from '../../apis/axiosInstance';
import { toast } from 'sonner';

interface Destination {
  _id: string;
  name: string;
  district: string;
  type: string;
  featured: boolean;
}

const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    try {
      const res = await api.get('/places');
      setDestinations(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (item: Destination) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await api.delete(`/places/${item._id}`);
        toast.success('Destination deleted');
        fetchDestinations();
      } catch (error) {
        toast.error('Failed to delete destination');
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Destination },
    { header: 'District', accessor: 'district' as keyof Destination },
    { header: 'Type', accessor: 'type' as keyof Destination },
    { 
      header: 'Status', 
      accessor: (item: Destination) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          item.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {item.featured ? 'Featured' : 'Standard'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Destinations" 
        description="Manage tourist spots and natural landmarks"
        buttonLabel="Add Destination"
        onButtonClick={() => navigate('/admin/destinations/new')}
      />
      
      <AdminTable 
        columns={columns} 
        data={destinations} 
        isLoading={loading}
        onEdit={(item) => navigate(`/admin/destinations/edit/${item._id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DestinationsPage;
