import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@/types';

export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  oauthProvider: {
    type: String,
    required: true
  },
  oauthId: {
    type: String,
    required: true
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

userSchema.index({ email: 1 });
userSchema.index({ oauthProvider: 1, oauthId: 1 });

export const UserModel = mongoose.model<UserDocument>('User', userSchema);