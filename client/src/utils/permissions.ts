/**
 * FRONTEND PERMISSION UTILITIES
 * Mirror of backend permissions for UI logic
 */

export type Role = 'admin' | 'editor' | 'user';
export type Permission = 
  | 'create_content'
  | 'edit_own_content'
  | 'edit_any_content'
  | 'delete_own_content'
  | 'delete_any_content'
  | 'publish_content'
  | 'submit_review'
  | 'approve_content'
  | 'manage_users'
  | 'manage_settings'
  | 'upload_media'
  | 'view_analytics'
  | 'manage_roles';

/**
 * Check if user has permission
 * Use this in components for conditional rendering
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
  const permissions: Record<Role, Permission[]> = {
    admin: [
      'create_content',
      'edit_own_content',
      'edit_any_content',
      'delete_own_content',
      'delete_any_content',
      'publish_content',
      'submit_review',
      'approve_content',
      'manage_users',
      'manage_settings',
      'upload_media',
      'view_analytics',
      'manage_roles',
    ],
    editor: [
      'create_content',
      'edit_own_content',
      'delete_own_content',
      'submit_review',
      'upload_media',
    ],
    user: [
      'view_analytics',
    ],
  };

  return permissions[role]?.includes(permission) ?? false;
};

/**
 * Check if user can edit/delete a resource
 * Editors can only modify their own
 */
export const canModifyResource = (
  userRole: Role,
  userId: string,
  resourceCreatedBy: string
): boolean => {
  if (userRole === 'admin') return true;
  if (userRole === 'editor') return userId === resourceCreatedBy;
  return false;
};

/**
 * Check if user can publish
 */
export const canPublish = (role: Role): boolean => {
  return hasPermission(role, 'publish_content');
};

/**
 * Check if user is admin
 */
export const isAdmin = (role: Role): boolean => {
  return role === 'admin';
};

/**
 * Check if user is editor or admin
 */
export const isEditorOrAdmin = (role: Role): boolean => {
  return role === 'editor' || role === 'admin';
};
