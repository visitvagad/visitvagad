/**
 * usePermissions Hook
 * Provides permission-checking utilities in React components
 */

import { useAppAuth } from "../context/AuthContext"
import { 
  hasPermission, 
  canModifyResource, 
  canPublish, 
  isAdmin, 
  isEditorOrAdmin,
  type Role,
  type Permission 
} from "../utils/permissions"

export const usePermissions = () => {
  const { role, user } = useAppAuth()

  if (!role || !user) {
    return {
      role: null,
      userId: null,
      hasPermission: () => false,
      canModifyResource: () => false,
      canPublish: () => false,
      isAdmin: () => false,
      isEditorOrAdmin: () => false,
      canCreate: () => false,
      canEdit: () => false,
      canDelete: () => false,
      canUploadMedia: () => false,
      canManageUsers: () => false,
      canViewAnalytics: () => false,
    }
  }

  return {
    role: role as Role,
    userId: user.id,
    hasPermission: (permission: Permission) => hasPermission(role as Role, permission),
    canModifyResource: (resourceCreatedBy: string) => 
      canModifyResource(role as Role, user.id, resourceCreatedBy),
    canPublish: () => canPublish(role as Role),
    isAdmin: () => isAdmin(role as Role),
    isEditorOrAdmin: () => isEditorOrAdmin(role as Role),
    canCreate: () => hasPermission(role as Role, 'create_content'),
    canEdit: () => hasPermission(role as Role, 'edit_own_content'),
    canDelete: () => hasPermission(role as Role, 'delete_own_content'),
    canUploadMedia: () => hasPermission(role as Role, 'upload_media'),
    canManageUsers: () => hasPermission(role as Role, 'manage_users'),
    canViewAnalytics: () => hasPermission(role as Role, 'view_analytics'),
  }
}
