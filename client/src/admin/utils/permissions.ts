export type Role = 'admin' | 'editor' | 'user';

export type ContentStatus = 'draft' | 'pending_review' | 'published';

export const PERMISSIONS = {
  CAN_DELETE: (role: Role) => role === 'admin',
  CAN_PUBLISH: (role: Role) => role === 'admin',
  CAN_MANAGE_USERS: (role: Role) => role === 'admin',
  CAN_EDIT_SETTINGS: (role: Role) => role === 'admin',
  CAN_UPLOAD: (role: Role) => ['admin', 'editor'].includes(role),
  CAN_CREATE: (role: Role) => ['admin', 'editor'].includes(role),
};

export const getStatusLabel = (status: ContentStatus) => {
  switch (status) {
    case 'draft': return 'Draft';
    case 'pending_review': return 'Pending Review';
    case 'published': return 'Published';
    default: return 'Unknown';
  }
};

export const getStatusColor = (status: ContentStatus) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-700';
    case 'pending_review': return 'bg-amber-100 text-amber-700';
    case 'published': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
