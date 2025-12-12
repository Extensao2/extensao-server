import Phase from '../models/Phase.js';
import Question from '../models/Question.js';
import SkillUpUserService from './SkillUpUserService.js';

/**
 * Service responsável pelas regras de negócio relacionadas a fases
 * (detalhes de fase de campanha e fase de modo seleção).
 */
class SkillUpPhaseService {
  /**
   * Busca os dados necessários para montar o detalhe de uma fase
   * de campanha para um usuário (fase, questões e progresso).
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado (req.user).
   * @param {string} phaseId ID da fase.
   * @returns {Promise<{ phase: any, questions: any[], playedPhase: any | null }>}
   */
  async getPhaseDetailData(user, phaseId) {
    if (!phaseId) {
      throw new Error('PHASE_ID_REQUIRED');
    }

    const phase = await Phase.findById(phaseId).lean();

    if (!phase) {
      throw new Error('PHASE_NOT_FOUND');
    }

    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const playedEntry = Array.isArray(userSkill.playedPhases)
      ? userSkill.playedPhases.find(p => String(p.phase) === String(phase._id))
      : null;

    const playedPhase = playedEntry
      ? {
          phaseId: String(phase._id),
          won: !!playedEntry.completed,
          starsEarned: typeof playedEntry.starsEarned === 'number' ? playedEntry.starsEarned : 0,
          datePlayed: playedEntry.datePlayed || null
        }
      : null;

    const questions = await Question.find({ phase: phase._id }).sort({ _id: 1 }).lean();

    return { phase, questions, playedPhase };
  }

  /**
   * Busca os dados necessários para montar os grupos de campanha
   * com base nas fases existentes e no progresso do usuário.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @returns {Promise<{ allPhases: any[], playedPhasesDocs: any[] }>}
   */
  async getCampaignGroupsData(user) {
    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const allPhases = await Phase.find().sort({ group: 1, position: 1 }).lean();
    const playedPhasesDocs = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases : [];

    return { allPhases, playedPhasesDocs };
  }

  /**
   * Busca as questões únicas para o modo seleção, aplicando as
   * regras de negócio de categoria, limite e embaralhamento.
   *
   * @param {string} rawMateria Valor vindo da rota (req.params.materia).
   * @returns {Promise<{ subjectId: number, category: string, questions: any[] }>}
   */
  async getSelectionModePhaseData(rawMateria) {
    const materiaId = Number.parseInt(rawMateria, 10);

    const SUBJECT_MAP = {
      0: 'MATH',
      1: 'LANGUAGES',
      2: 'SCIENCE',
      3: 'HISTORY'
    };

    const category = SUBJECT_MAP[materiaId];

    if (!Number.isInteger(materiaId) || !category) {
      throw new Error('INVALID_SUBJECT_ID');
    }

    const limit = 10;

    const allQuestions = await Question.find({ category }).lean();

    if (!allQuestions.length) {
      throw new Error('NO_QUESTIONS_FOR_SUBJECT');
    }

    const uniqueMap = new Map();
    allQuestions.forEach(q => {
      const key = q.statement || `${q.title}|${q._id}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, q);
      }
    });

    let uniqueQuestions = Array.from(uniqueMap.values());

    for (let i = uniqueQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueQuestions[i], uniqueQuestions[j]] = [uniqueQuestions[j], uniqueQuestions[i]];
    }

    const selectedQuestions = uniqueQuestions.slice(0, limit);

    return {
      subjectId: materiaId,
      category,
      questions: selectedQuestions
    };
  }
}

export default new SkillUpPhaseService();
