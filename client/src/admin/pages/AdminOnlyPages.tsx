import React from 'react';
import AdminPageHeader from '../components/AdminPageHeader';

const AdminOnlyPlaceholder: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="space-y-6">
    <AdminPageHeader title={title} description={description} />
    <div className="bg-red-50 p-12 rounded-xl border border-red-200 border-dashed text-center">
      <p className="text-red-600 font-bold italic underline">Restricted Area: Admin Access Only</p>
      <p className="text-red-500 mt-2">You have entered a system-level configuration module.</p>
    </div>
  </div>
);

export const UsersPage = () => <AdminOnlyPlaceholder title="User Management" description="Manage administrative access and roles" />;
export const SettingsPage = () => <AdminOnlyPlaceholder title="System Settings" description="Configure platform-wide parameters" />;
