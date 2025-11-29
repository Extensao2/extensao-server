const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const itemSchema = require('./Item');
const phaseSchema = require('./Phase');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  lifesRemaining: { type: Number, default: 3 },
  dateTimeLostLife: Date,
  mathSkillPoints: { type: Number, default: 0 },
  historySkillPoints: { type: Number, default: 0 },
  languageSkillPoints: { type: Number, default: 0 },
  itemsOwned: [{ type: Schema.Types.ObjectId, ref: 'Item' }], // N:N
  equippedItems: [{ type: Schema.Types.ObjectId, ref: 'Item' }], // subset of itemsOwned
  playedPhases: [{
    phase: { type: Schema.Types.ObjectId, ref: 'Phase' },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 }
  }],
  recommendedPhases: [{ type: Schema.Types.ObjectId, ref: 'Phase' }]
});

const UserSkillUp = model('UserSkillUp', userSchema);
module.exports = { UserSkillUp };
