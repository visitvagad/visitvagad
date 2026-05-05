import React from 'react';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
  title, 
  description, 
  buttonLabel, 
  onButtonClick 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>{buttonLabel}</span>
        </button>
      )}
    </div>
  );
};

export default AdminPageHeader;
