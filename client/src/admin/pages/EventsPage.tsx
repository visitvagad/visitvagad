import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminTable from '../components/AdminTable';
import api from '../../apis/axiosInstance';

interface Event {
  _id: string;
  name: string;
  date: string;
  location: string;
  recurring: boolean;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const columns = [
    { header: 'Event Name', accessor: 'name' as keyof Event },
    { header: 'Date', accessor: 'date' as keyof Event },
    { header: 'Location', accessor: 'location' as keyof Event },
    { 
      header: 'Type', 
      accessor: (item: Event) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          item.recurring ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {item.recurring ? 'Annual' : 'One-time'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Events & Festivals" 
        description="Manage cultural activities and seasonal celebrations"
        buttonLabel="Add Event"
        onButtonClick={() => navigate('/admin/events/new')}
      />
      
      <AdminTable 
        columns={columns} 
        data={events} 
        isLoading={loading}
        onEdit={(item) => navigate(`/admin/events/edit/${item._id}`)}
        onDelete={() => {}}
      />
    </div>
  );
};

export default EventsPage;
