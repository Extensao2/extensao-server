import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const resourceSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
resourceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Transform output to match API spec
resourceSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    id: obj.id,
    title: obj.title,
    content: obj.content
  };
};

export default mongoose.model('Resource', resourceSchema);