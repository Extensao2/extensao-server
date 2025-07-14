import mongoose, { Schema, Document } from 'mongoose';
import { Resource } from '@/types';

export interface ResourceDocument extends Resource, Document {}

const resourceSchema = new Schema<ResourceDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.createdBy;
      return ret;
    }
  }
});

resourceSchema.index({ title: 'text' });
resourceSchema.index({ createdBy: 1 });
resourceSchema.index({ createdAt: -1 });

export const ResourceModel = mongoose.model<ResourceDocument>('Resource', resourceSchema);