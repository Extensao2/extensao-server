import Phase from '../models/Phase.js';
import UserSkillUp from '../models/UserSkillUp.js';
import Product from '../models/Product.js';
import SkillUpUserService from './SkillUpUserService.js';

/**
 * Service responsável pelas regras de negócio de progresso em fases
 * (atribuição de fases jogadas e consulta por e-mail).
 */
class SkillUpProgressService {
  /**
   * Registra ou atualiza o progresso do usuário em um conjunto de fases.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @param {Array<any> | null} phasesInput Array vindo do corpo da requisição.
   * @returns {Promise<{ userSkill: any, coinsEarned: number, itemEarned: any | null }>}
   */
  async assignPhasesToUser(user, phasesInput) {
    if (!phasesInput || !Array.isArray(phasesInput) || phasesInput.length === 0) {
      throw new Error('PHASES_ARRAY_REQUIRED');
    }

    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const phaseIds = phasesInput
      .map(item => item && item.phaseId)
      .filter(id => !!id);

    if (phaseIds.length === 0) {
      throw new Error('AT_LEAST_ONE_PHASE_ID_REQUIRED');
    }

    const uniquePhaseIds = Array.from(new Set(phaseIds.map(id => String(id))));
    const phases = await Phase.find({ _id: { $in: uniquePhaseIds } }).select('_id isBossPhase').lean();
    const validIdsSet = new Set(phases.map(phase => String(phase._id)));
    const phasesById = new Map(phases.map(phase => [String(phase._id), phase]));

    const invalidPhaseIds = uniquePhaseIds.filter(id => !validIdsSet.has(id));
    if (invalidPhaseIds.length > 0) {
      const error = new Error('INVALID_PHASE_IDS');
      // @ts-ignore - campo adicional para transporte de dados de erro
      error.invalidPhaseIds = invalidPhaseIds;
      throw error;
    }

    if (!Array.isArray(userSkill.playedPhases)) {
      userSkill.playedPhases = [];
    }

    // Preenche datas antigas se faltarem
    userSkill.playedPhases.forEach(entry => {
      if (!entry.datePlayed && entry.completed) {
        entry.datePlayed = new Date();
      }
    });

    let livesToLose = 0;
    let totalCoinsEarned = 0;
    let bossVictoryHappened = false;

    phasesInput.forEach(item => {
      const id = item && item.phaseId ? String(item.phaseId) : null;
      if (!id || !validIdsSet.has(id)) {
        return;
      }

      const existingEntry = userSkill.playedPhases.find(p => String(p.phase) === id);

      const completedProvided = typeof item.completed === 'boolean';
      const starsProvided = typeof item.starsEarned === 'number';

      const phaseDoc = phasesById.get(id);
      const isBossPhase = !!(phaseDoc && phaseDoc.isBossPhase);

      const previousCompleted = existingEntry ? !!existingEntry.completed : false;
      const previousStars = existingEntry && typeof existingEntry.starsEarned === 'number'
        ? existingEntry.starsEarned
        : 0;

      if (existingEntry) {
        if (completedProvided) {
          existingEntry.completed = item.completed;
        }
        if (starsProvided) existingEntry.starsEarned = item.starsEarned;

        if (item.datePlayed) {
          existingEntry.datePlayed = new Date(item.datePlayed);
        } else if (!existingEntry.datePlayed) {
          existingEntry.datePlayed = new Date();
        }
      } else {
        userSkill.playedPhases.push({
          phase: id,
          completed: completedProvided ? item.completed : false,
          starsEarned: starsProvided ? item.starsEarned : 0,
          datePlayed: item.datePlayed ? new Date(item.datePlayed) : new Date()
        });
      }

      const currentEntry = existingEntry || userSkill.playedPhases.find(p => String(p.phase) === id);
      const nowCompleted = currentEntry ? !!currentEntry.completed : false;
      const nowStars = currentEntry && typeof currentEntry.starsEarned === 'number'
        ? currentEntry.starsEarned
        : 0;

      // Ganha coins em qualquer fase (normal ou boss) ao completar pela primeira vez
      if (!previousCompleted && nowCompleted) {
        let coinsForThisPhase = 0;
        if (nowStars === 3) coinsForThisPhase = 300;
        else if (nowStars === 2) coinsForThisPhase = 200;
        else if (nowStars === 1) coinsForThisPhase = 100;

        totalCoinsEarned += coinsForThisPhase;

        // Marca vitória em boss apenas para controle de drop de item
        if (isBossPhase) {
          bossVictoryHappened = true;
        }
      }

      if (completedProvided && item.completed === false) {
        livesToLose += 1;
      }
    });

    if (livesToLose > 0) {
      const currentLives = typeof userSkill.lifesRemaining === 'number' ? userSkill.lifesRemaining : 0;
      userSkill.lifesRemaining = Math.max(0, currentLives - livesToLose);
      userSkill.lifeLostAt = new Date();
    }

    if (totalCoinsEarned > 0) {
      const currentCoins = typeof userSkill.coins === 'number' ? userSkill.coins : 0;
      userSkill.coins = currentCoins + totalCoinsEarned;
    }

    let itemEarned = null;

    if (bossVictoryHappened) {
      const products = await Product.find().lean();

      if (Array.isArray(products) && products.length > 0) {
        const randomIndex = Math.floor(Math.random() * products.length);
        const randomProduct = products[randomIndex];

        const alreadyOwned = userSkill.itemsOwned.some(id => id.toString() === randomProduct._id.toString());

        if (!alreadyOwned) {
          userSkill.itemsOwned.push(randomProduct._id);
        }

        itemEarned = randomProduct;
      }
    }

    await userSkill.save();

    return {
      userSkill,
      coinsEarned: totalCoinsEarned,
      itemEarned
    };
  }

  /**
   * Retorna o documento UserSkillUp com as fases jogadas populadas
   * a partir de um e-mail, para construção de DTO de histórico.
   *
   * @param {string | undefined} email E-mail do usuário alvo.
   * @returns {Promise<any>} Documento UserSkillUp com playedPhases populado.
   */
  async getPlayedPhasesByEmail(email) {
    if (!email) {
      throw new Error('EMAIL_REQUIRED');
    }

    const userSkill = await UserSkillUp.findOne({ email }).populate('playedPhases.phase');

    if (!userSkill) {
      throw new Error('USER_NOT_FOUND');
    }

    return userSkill;
  }
}

export default new SkillUpProgressService();
