import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminTable from '../components/AdminTable';
import api from '../../apis/axiosInstance';

interface Food {
  _id: string;
  name: string;
  category: string;
}

const FoodPage: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFoods = async () => {
    try {
      const res = await api.get('/food');
      setFoods(res.data.data);
    } catch (error) {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const columns = [
    { header: 'Item Name', accessor: 'name' as keyof Food },
    { header: 'Category', accessor: 'category' as keyof Food },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Local Food & Cuisines" 
        description="Manage the flavors and culinary heritage of Vagad"
        buttonLabel="Add Food Item"
        onButtonClick={() => navigate('/admin/food/new')}
      />
      
      <AdminTable 
        columns={columns} 
        data={foods} 
        isLoading={loading}
        onEdit={(item) => navigate(`/admin/food/edit/${item._id}`)}
        onDelete={() => {}}
      />
    </div>
  );
};

export default FoodPage;
