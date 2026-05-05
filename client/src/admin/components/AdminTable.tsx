import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useAppAuth } from '../../context/AuthContext';
import { PERMISSIONS, getStatusColor, getStatusLabel } from '../utils/permissions';
import type { Role } from '../utils/permissions';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
}

const AdminTable = <T extends { _id?: string; id?: string; status?: any }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete,
  isLoading 
}: AdminTableProps<T>) => {
  const { role } = useAppAuth();
  const canDelete = PERMISSIONS.CAN_DELETE(role as Role);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Prepend status column if it's not already there and data has status
  const tableColumns = [...columns];
  if (data.length > 0 && data[0].status && !columns.find(c => c.header === 'Status')) {
    tableColumns.push({
      header: 'Status',
      accessor: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
          {getStatusLabel(item.status)}
        </span>
      )
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {tableColumns.map((column, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || (onDelete && canDelete)) && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item._id || item.id || idx} className="hover:bg-gray-50/50 transition-colors">
                  {tableColumns.map((column, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 text-sm text-gray-700 ${column.className || ''}`}>
                      {typeof column.accessor === 'function' 
                        ? column.accessor(item) 
                        : (item[column.accessor as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                  {(onEdit || (onDelete && canDelete)) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && canDelete && (
                          <button 
                            onClick={() => onDelete(item)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
