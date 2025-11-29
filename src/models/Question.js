const mongoose = require('mongoose');
const { Schema, model } = mongoose;



const questionSchema = new Schema({
  description: { type: String, required: true },
  subject: String,
  topic: String,
  alternatives: { type: [String], required: true },
  correctAlternative: { type: String, required: true }
});


const Question = model('Question', questionSchema);
module.exports = { Question };
