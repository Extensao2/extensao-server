import mongoose from 'mongoose';

const { Schema, model } = mongoose;
import { questionSchema } from './Question.js';

const phaseSchema = new Schema({
  name: { type: String, required: true },
  isBossPhase: { type: Boolean, default: false },
  group: { type: Number, min: 1, max: 5 },
  position: { type: Number, min: 1, max: 5 },
  questions: [questionSchema] // 1:N Perguntas
});

const Phase = model('Phase', phaseSchema);

export default Phase;