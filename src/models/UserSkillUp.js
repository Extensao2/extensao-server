import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  lifesRemaining: { type: Number, default: 5 },
  lifeRecoveredAt: { type: Date, default: null },
  lifeLostAt: { type: Date, default: null },
  mathSkillPoints: { type: Number, default: 0 },
  scienceSkillPoints: { type: Number, default: 0 },
  historySkillPoints: { type: Number, default: 0 },
  languageSkillPoints: { type: Number, default: 0 },
  itemsOwned: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // N:N
  equippedItems: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // subset of itemsOwned
  playedPhases: [{
    phase: { type: Schema.Types.ObjectId, ref: 'Phase' },
    completed: { type: Boolean, default: false },
    starsEarned: { type: Number, default: 0 },
    datePlayed: { type: Date }
  }],
  recommendedPhases: [{ type: Schema.Types.ObjectId, ref: 'Phase' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

/**
 * Hook de pré-save que atualiza o campo updatedAt sempre que o
 * documento UserSkillUp é salvo.
 *
 * @this import('mongoose').Document
 * @param {Function} next Função de continuação do Mongoose.
 */
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserSkillUp = model('UserSkillUp', userSchema);

export default UserSkillUp;

