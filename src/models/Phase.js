import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const phaseSchema = new Schema({
  name: { type: String, required: true },
  isBossPhase: { type: Boolean, default: false },
  group: { type: Number, min: 1, max: 5 },
  position: { type: Number, min: 1, max: 5 }
});

const Phase = model('Phase', phaseSchema);

export default Phase;