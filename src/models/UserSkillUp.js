import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  lifesRemaining: { type: Number, default: 3 },
  dateLostLife: Date,
  mathSkillPoints: { type: Number, default: 0 },
  scienceSkillPoints: { type: Number, default: 0 },
  historySkillPoints: { type: Number, default: 0 },
  languageSkillPoints: { type: Number, default: 0 },
  itemsOwned: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // N:N
  equippedItems: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // subset of itemsOwned
  playedPhases: [{
    phase: { type: Schema.Types.ObjectId, ref: 'Phase' },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    starsEarned: { type: Number, default: 0 },
    datePlayed: { type: Date }
  }],
  recommendedPhases: [{ type: Schema.Types.ObjectId, ref: 'Phase' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserSkillUp = model('UserSkillUp', userSchema);

export default UserSkillUp;

