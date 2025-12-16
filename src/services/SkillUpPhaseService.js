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

  async getRecommendationModePhasesData(user) {
  const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

  const playedPhases = Array.isArray(userSkill.playedPhases)
    ? userSkill.playedPhases.filter(p => p && p.phase)
    : [];

  if (!playedPhases.length) {
    return [];
  }

  const phaseIds = playedPhases.map(p => p.phase);

  const questions = await Question.find({ phase: { $in: phaseIds } }).lean();

  const phaseMetaMap = new Map();
  for (const q of questions) {
    const phaseIdStr = String(q.phase);
    if (!phaseMetaMap.has(phaseIdStr)) {
      phaseMetaMap.set(phaseIdStr, {
        subject: typeof q.category === 'string' ? q.category : null,
        topic: typeof q.topic === 'string' ? q.topic : null
      });
    }
  }

  const recommendations = playedPhases
    .map(p => {
      const phaseIdStr = String(p.phase);
      const meta = phaseMetaMap.get(phaseIdStr) || { subject: null, topic: null };

      return {
        phaseId: phaseIdStr,
        subject: meta.subject,
        topic: meta.topic,
        createdAt: p.datePlayed || null
      };
    })
    .sort((a, b) => {
      const aTime = a.createdAt ? a.createdAt.getTime() : 0;
      const bTime = b.createdAt ? b.createdAt.getTime() : 0;
      return bTime - aTime;
    });

  return recommendations;
} 

  /**
   * Retorna os dados necessários para o modo seleção, escolhendo
   * uma fase aleatória associada à matéria informada.
   *
   * @param {string} rawMateria Valor vindo da rota (req.params.materia).
   * @returns {Promise<{ subjectId: number, category: string, phaseId: string }>}
   */
  async getSelectionModePhaseData(user, rawMateria) {
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

    const allQuestions = await Question.find({ category }).lean();

    if (!allQuestions.length) {
      throw new Error('NO_QUESTIONS_FOR_SUBJECT');
    }

    const allPhaseIdsSet = new Set(allQuestions.map(q => String(q.phase)));
    const allPhaseIds = Array.from(allPhaseIdsSet);

    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const playedPhasesDocs = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases : [];
    const playedPhaseIdsSet = new Set(playedPhasesDocs.map(p => String(p.phase)));

    const notPlayedPhaseIds = allPhaseIds.filter(id => !playedPhaseIdsSet.has(id));

    const candidates = notPlayedPhaseIds.length > 0 ? notPlayedPhaseIds : allPhaseIds;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosenPhaseId = candidates[randomIndex];

    if (!chosenPhaseId) {
      throw new Error('NO_QUESTIONS_FOR_SUBJECT');
    }

    return {
      subjectId: materiaId,
      category,
      phaseId: chosenPhaseId
    };
  }
}

export default new SkillUpPhaseService();
