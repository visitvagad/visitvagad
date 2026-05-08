/**
 * CENTRALIZED RBAC PERMISSION SYSTEM
 * Single source of truth for all role-based permissions
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

export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'rejected';

/**
 * PERMISSION MATRIX
 * Centralized definition of all role permissions
 */
export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
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
  user: [],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false;
};

/**
 * Check if user can modify a resource
 * Rules:
 * - Admins can modify anything
 * - Editors can only modify their own content
 */
export const canModifyResource = (
  userRole: Role,
  userId: string,
  resourceCreatedBy?: string
): boolean => {
  if (userRole === 'admin') return true;
  if (userRole === 'editor') return userId === resourceCreatedBy;
  return false;
};

/**
 * Check if user can publish content
 * Only admins can publish
 */
export const canPublishContent = (userRole: Role): boolean => {
  return hasPermission(userRole, 'publish_content');
};

/**
 * Check if user can manage users
 * Only admins
 */
export const canManageUsers = (userRole: Role): boolean => {
  return hasPermission(userRole, 'manage_users');
};

/**
 * Check if user can manage system settings
 * Only admins
 */
export const canManageSettings = (userRole: Role): boolean => {
  return hasPermission(userRole, 'manage_settings');
};

/**
 * Get next status in workflow
 * Editor submits for review → Admin approves/rejects → Published
 */
export const getNextStatus = (
  currentStatus: ContentStatus,
  userRole: Role,
  action: 'save' | 'submit' | 'approve' | 'reject' | 'publish'
): ContentStatus => {
  // Admin action
  if (userRole === 'admin') {
    if (action === 'publish' || action === 'approve') return 'published';
    if (action === 'reject') return 'rejected';
    if (action === 'save') return 'draft';
  }

  // Editor action
  if (userRole === 'editor') {
    if (action === 'save') return 'draft';
    if (action === 'submit') return 'pending_review';
  }

  return currentStatus;
};

/**
 * Check if content status should be visible to user
 * Rules:
 * - Published: always visible
 * - Draft: only to creator and admins
 * - Pending Review: to creator, admins
 * - Rejected: to creator, admins
 */
export const canViewContent = (
  status: ContentStatus,
  userRole: Role,
  userId: string,
  contentCreatedBy?: string
): boolean => {
  // Admin can see everything
  if (userRole === 'admin') return true;

  // Published is visible to everyone
  if (status === 'published') return true;

  // Creator can see their own
  if (userId === contentCreatedBy) return true;

  // Others cannot see draft/pending/rejected
  return false;
};

/**
 * Filter query to show only content user should see
 */
export const getContentFilter = (
  userRole: Role,
  userId: string
): Record<string, any> => {
  if (userRole === 'admin') {
    // Admins see everything
    return {};
  }

  if (userRole === 'editor') {
    // Editors see published + their own
    return {
      $or: [
        { status: 'published' },
        { createdBy: userId },
      ],
    };
  }

  // Public/User sees only published
  return {
    status: 'published',
  };
};
