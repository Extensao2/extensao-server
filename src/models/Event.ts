import mongoose, { Schema, Document } from 'mongoose';
import { Event } from '@/types';

export interface EventDocument extends Event, Document {}

const eventSchema = new Schema<EventDocument>({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  data: {
    type: Date,
    required: true
  },
  descricao: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
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
      return ret;
    }
  }
});

eventSchema.index({ userId: 1 });
eventSchema.index({ data: -1 });
eventSchema.index({ nome: 'text', descricao: 'text' });

export const EventModel = mongoose.model<EventDocument>('Event', eventSchema);