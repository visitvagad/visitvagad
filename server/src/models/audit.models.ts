/**
 * AUDIT LOG SYSTEM
 * Track all sensitive operations for compliance and debugging
 */

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  changes?: Record<string, { before: any; after: any }>;
  status: 'success' | 'failure';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'CREATE_CONTENT',
        'UPDATE_CONTENT',
        'DELETE_CONTENT',
        'PUBLISH_CONTENT',
        'SUBMIT_REVIEW',
        'APPROVE_CONTENT',
        'REJECT_CONTENT',
        'UPDATE_ROLE',
        'DELETE_USER',
        'UPDATE_SETTINGS',
        'UPLOAD_MEDIA',
      ],
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['Place', 'Hotel', 'Event', 'Food', 'Itinerary', 'User', 'Settings', 'Media'],
      index: true,
    },
    resourceId: {
      type: String,
      index: true,
    },
    resourceName: {
      type: String,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
    errorMessage: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 90 * 24 * 60 * 60, // Auto-delete after 90 days
    },
  },
  {
    timestamps: false,
  }
);

const AuditLog: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;

/**
 * Helper function to log audit events
 */
export const logAudit = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  resourceName?: string,
  changes?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
  status: 'success' | 'failure' = 'success',
  errorMessage?: string,
  userEmail?: string
) => {
  try {
    await AuditLog.create({
      userId,
      userEmail,
      action,
      resourceType,
      resourceId,
      resourceName,
      changes,
      status,
      errorMessage,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  } catch (error) {
    // Don't fail the actual request if audit logging fails
    console.error('Failed to log audit event:', error);
  }
};

/**
 * Get audit logs with filtering
 */
export const getAuditLogs = async (
  filters: {
    userId?: string;
    action?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
  } = {}
) => {
  const query: Record<string, any> = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.action) query.action = filters.action;
  if (filters.resourceType) query.resourceType = filters.resourceType;

  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = filters.startDate;
    if (filters.endDate) query.timestamp.$lte = filters.endDate;
  }

  const limit = filters.limit || 50;
  const skip = filters.skip || 0;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    total,
    limit,
    skip,
    pages: Math.ceil(total / limit),
  };
};
