import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Hotel, 
  Calendar, 
  TrendingUp, 
  Users,
  Clock
} from 'lucide-react';
import { useAppAuth } from '../../context/AuthContext';
import api from '../../apis/axiosInstance';
import { getStatusColor, getStatusLabel } from '../utils/permissions';

const AdminDashboard: React.FC = () => {
  const { role, user } = useAppAuth();
  const [stats, setStats] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch global stats
        const statsRes = await api.get('/places/stats');
        setStats(statsRes.data.data);

        // Fetch role-specific content
        let itemsRes;
        if (role === 'editor') {
          // Editors see their own recent items
          itemsRes = await api.get('/places', { params: { createdBy: user?.id, limit: 5 } });
        } else {
          // Admins see items pending review
          itemsRes = await api.get('/places', { params: { status: 'pending_review', limit: 5 } });
        }
        setItems(itemsRes.data.data.places || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [role, user]);

  const statCards = [
    { name: 'Total Destinations', value: stats?.totalPlaces || '...', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Pending Review', value: stats?.pendingReview || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Monthly Visitors', value: '1.2k', icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  if (role === 'admin') {
    statCards.push({ name: 'Registered Users', value: stats?.totalUsers || '...', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name || 'Administrator'}. 
          {role === 'editor' ? " You're in Editor Mode." : " You have full system access."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Role-specific sections */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">
            {role === 'editor' ? 'My Recent Submissions' : 'Items Awaiting Review'}
          </h3>
          <button className="text-sm text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="px-6 py-4 animate-pulse bg-gray-50/50 h-16"></div>)
          ) : items.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 italic">
              {role === 'editor' ? "You haven't submitted any content yet." : "No items currently pending review."}
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Updated {new Date(item.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                  {getStatusLabel(item.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-dashed border-gray-300 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors group">
            <MapPin className="text-gray-400 mb-2 group-hover:text-primary" size={24} />
            <p className="text-sm font-semibold text-gray-800">Add Destination</p>
          </button>
          <button className="p-4 border border-dashed border-gray-300 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors group">
            <ImageIcon className="text-gray-400 mb-2 group-hover:text-primary" size={24} />
            <p className="text-sm font-semibold text-gray-800">Upload Media</p>
          </button>
          <button className="p-4 border border-dashed border-gray-300 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors group">
            <Hotel className="text-gray-400 mb-2 group-hover:text-primary" size={24} />
            <p className="text-sm font-semibold text-gray-800">Add Hotel</p>
          </button>
          <button className="p-4 border border-dashed border-gray-300 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors group">
            <Calendar className="text-gray-400 mb-2 group-hover:text-primary" size={24} />
            <p className="text-sm font-semibold text-gray-800">New Event</p>
          </button>
        </div>
      </div>
    </div>
  );
};

import { Image as ImageIcon } from 'lucide-react';

export default AdminDashboard;
