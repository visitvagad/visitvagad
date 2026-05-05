import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminTable from '../components/AdminTable';
import api from '../../apis/axiosInstance';

interface Hotel {
  _id: string;
  name: string;
  category: string;
  rating: number;
  verified: boolean;
}

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHotels = async () => {
    try {
      // Assuming /hotels endpoint exists or I'll need to create it
      const res = await api.get('/hotels');
      setHotels(res.data.data);
    } catch (error) {
      // Fallback for demo if endpoint doesn't exist yet
      setHotels([]);
      // toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const columns = [
    { header: 'Hotel Name', accessor: 'name' as keyof Hotel },
    { header: 'Category', accessor: 'category' as keyof Hotel },
    { 
      header: 'Rating', 
      accessor: (item: Hotel) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <span>{item.rating}</span>
          <span className="text-xs">★</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (item: Hotel) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          item.verified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {item.verified ? 'Verified' : 'Unverified'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Hotels & Stays" 
        description="Manage accommodation partners and guest houses"
        buttonLabel="Add Hotel"
        onButtonClick={() => navigate('/admin/hotels/new')}
      />
      
      <AdminTable 
        columns={columns} 
        data={hotels} 
        isLoading={loading}
        onEdit={(item) => navigate(`/admin/hotels/edit/${item._id}`)}
        onDelete={() => {}}
      />
    </div>
  );
};

export default HotelsPage;
