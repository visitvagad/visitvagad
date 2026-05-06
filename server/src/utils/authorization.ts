/**
 * AUTHORIZATION UTILITIES
 * Centralized authorization logic to prevent code duplication
 */

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import ApiError from './apiError';
import { hasPermission, canModifyResource, Permission, Role } from './permissions';

/**
 * Create a role-based authorization middleware
 * Single middleware that works with permission matrix
 */
export const authorize = (...permissions: Permission[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized - No user');
    }

    const userRole = req.user.role as Role;
    const hasAnyPermission = permissions.some((perm) =>
      hasPermission(userRole, perm)
    );

    if (!hasAnyPermission) {
      throw new ApiError(403, `Forbidden - Insufficient permissions. Required: ${permissions.join(', ')}`);
    }

    next();
  };
};

/**
 * Ownership authorization middleware
 * Checks if user owns the resource (except for admin)
 */
export const authorizeOwnership = (resourceFieldName: string = 'createdBy') => {
  return async (req: AuthRequest, _: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized');
      }

      // For now, we'll attach this logic to individual controllers
      // This middleware just validates the user exists
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper to validate resource ownership
 * Use this in controllers before modifying content
 * 
 * Usage:
 * const resource = await Model.findById(id);
 * validateResourceOwnership(req.user, resource, req.user.id);
 */
export const validateResourceOwnership = (
  userRole: Role,
  userId: string,
  resource: { createdBy?: string; [key: string]: any },
  actionName: string = 'access this resource'
) => {
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  if (!canModifyResource(userRole, userId, resource.createdBy)) {
    throw new ApiError(
      403,
      `You don't have permission to ${actionName}. Only admins or the creator can do this.`
    );
  }
};

/**
 * Validate resource ownership with custom error message
 */
export const ensureOwnershipOrAdmin = (
  userRole: Role,
  userId: string,
  resourceCreatedBy: string
) => {
  if (userRole === 'admin') return;
  if (userId !== resourceCreatedBy) {
    throw new ApiError(403, 'You can only modify content you created');
  }
};
