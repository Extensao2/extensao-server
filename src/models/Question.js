import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const questionSchema = new Schema({
  phase: { type: Schema.Types.ObjectId, ref: 'Phase', required: true },
  category: {
    type: String,
    enum: ['MATH', 'HISTORY', 'SCIENCE', 'LANGUAGES'],
    required: true
  },
  topic: { type: String },
  title: { type: String, required: true },
  statement: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptionIndex: { type: Number, default: 0 },
  points: { type: Number, default: 10 },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const Question = model('Question', questionSchema);

export default Question;
