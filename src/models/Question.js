import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const questionSchema = new Schema({
  description: { type: String, required: true },
  subject: String,
  topic: String,
  alternatives: { type: [String], required: true },
  correctAlternative: { type: String, required: true }
});

const Question = model('Question', questionSchema);

export default Question;
