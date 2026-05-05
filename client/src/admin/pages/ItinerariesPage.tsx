import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminTable from '../components/AdminTable';
import api from '../../apis/axiosInstance';

interface Itinerary {
  _id: string;
  title: string;
  days: any[];
  featured: boolean;
}

const ItinerariesPage: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      const res = await api.get('/itineraries');
      setItineraries(res.data.data);
    } catch (error) {
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const columns = [
    { header: 'Title', accessor: 'title' as keyof Itinerary },
    { 
      header: 'Duration', 
      accessor: (item: Itinerary) => `${item.days?.length || 0} Days`
    },
    { 
      header: 'Status', 
      accessor: (item: Itinerary) => (
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
        title="Travel Itineraries" 
        description="Curate multi-day travel experiences for visitors"
        buttonLabel="Build Itinerary"
        onButtonClick={() => navigate('/admin/itineraries/new')}
      />
      
      <AdminTable 
        columns={columns} 
        data={itineraries} 
        isLoading={loading}
        onEdit={(item) => navigate(`/admin/itineraries/edit/${item._id}`)}
        onDelete={() => {}}
      />
    </div>
  );
};

export default ItinerariesPage;
