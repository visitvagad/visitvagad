import { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import { getAllUsersApi, updateUserRoleApi, deleteUserApi } from '../../apis/auth.api';
import type { IUser } from '../../types';
import { toast } from 'sonner';
import { Shield, User, Mail, Trash2, CheckCircle, XCircle, Globe, Database, Lock } from 'lucide-react';
import Loader from '../../components/common/Loader';

/* ---------- USER MANAGEMENT PAGE ---------- */

export const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      setUsers(res?.data?.data?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load system guardians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRoleApi(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      toast.success(`Authority reassigned to ${newRole.toUpperCase()}`);
    } catch (error) {
      toast.error('Authority reassignment failed');
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('Are you sure you want to deactivate this account? Access will be immediately revoked.')) return;
    try {
      await deleteUserApi(id);
      toast.success('Account deactivated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to deactivate account');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <AdminPageHeader
        title="Guardian Directory"
        description="Manage system access, assign administrative roles, and oversee platform security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40">Identity</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40">Authority</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{u.name}</p>
                          <div className="flex items-center gap-1.5 text-on-surface/40 text-xs">
                            <Mail size={12} />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        {['user', 'editor', 'admin'].map(r => (
                          <button
                            key={r}
                            onClick={() => handleUpdateRole(u.id, r)}
                            disabled={u.role === r}
                            className={`text-[9px] font-bold px-3 py-1 rounded-full border tracking-widest uppercase transition-all ${u.role === r
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                : 'border-outline-variant/20 text-on-surface/40 hover:border-primary hover:text-primary'
                              }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleDeactivate(u.id)}
                          className="p-2 rounded-full hover:bg-red-50 text-on-surface/20 hover:text-red-500 transition-all"
                          title="Deactivate Guardian"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- SYSTEM SETTINGS PAGE ---------- */

export const SettingsPage = () => {
  const settingsGroups = [
    {
      title: "Platform Identity",
      icon: <Globe size={20} className="text-primary" />,
      items: [
        { label: "Site Name", value: "Visit Vagad", type: "text" },
        { label: "Public URL", value: "https://visitvagad.com", type: "text" },
        { label: "Meta Description", value: "The ultimate guide to Vagad's heritage.", type: "textarea" },
      ]
    },
    {
      title: "Security & Access",
      icon: <Lock size={20} className="text-secondary" />,
      items: [
        { label: "Self-Registration", value: "Enabled", type: "toggle", status: true },
        { label: "Admin Approval", value: "Disabled", type: "toggle", status: false },
        { label: "Session Timeout", value: "7 Days", type: "select" },
      ]
    },
    {
      title: "Infrastructure",
      icon: <Database size={20} className="text-orange-500" />,
      items: [
        { label: "Database Status", value: "Connected", type: "status", status: true },
        { label: "Cloudinary Sync", value: "Active", type: "status", status: true },
        { label: "Email Server", value: "SMTP - AWS SES", type: "text" },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <AdminPageHeader
        title="Core Configurations"
        description="Fine-tune platform parameters, manage API integrations, and oversee system health."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settingsGroups.map((group, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-surface-container-low">
                {group.icon}
              </div>
              <h3 className="text-lg font-epilogue font-bold text-on-surface">{group.title}</h3>
            </div>

            <div className="space-y-6">
              {group.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-outline-variant/5 last:border-0">
                  <span className="text-sm font-medium text-on-surface/60">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.type === 'status' && (
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${item.status ? 'text-green-500' : 'text-red-500'}`}>
                        {item.status ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {item.value}
                      </span>
                    )}
                    {(item.type === 'text' || item.type === 'select') && (
                      <span className="text-sm font-bold text-on-surface">{item.value}</span>
                    )}
                    {item.type === 'toggle' && (
                      <div className={`w-10 h-5 rounded-full p-1 transition-colors ${item.status ? 'bg-primary' : 'bg-outline-variant/30'}`}>
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${item.status ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Configure {group.title.split(' ')[0]}
            </button>
          </div>
        ))}

        {/* Audit Log Hint */}
        <div className="md:col-span-2 bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield size={24} />
            </div>
            <div>
              <p className="font-bold text-on-surface">System Audit Logs</p>
              <p className="text-sm text-on-surface/60">Every administrative action is tracked for maximum transparency.</p>
            </div>
          </div>
          <button className="bg-on-surface text-surface px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
            View Activity Feed
          </button>
        </div>
      </div>
    </div>
  );
};
