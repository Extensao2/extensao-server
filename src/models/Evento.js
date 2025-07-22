import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const eventoSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  data: {
    type: Date,
    required: true
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: 1000
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
eventoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Transform output to match API spec
eventoSchema.methods.toJSON = function() {
  const obj = this.toObject();
  return {
    id: obj.id,
    nome: obj.nome,
    data: obj.data.toISOString(),
    descricao: obj.descricao || ''
  };
};

export default mongoose.model('Evento', eventoSchema);