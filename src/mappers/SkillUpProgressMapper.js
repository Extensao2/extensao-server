/**
 * Mappers relacionados a progresso de fases (playedPhases).
 */

/**
 * Monta o DTO de resposta após atribuição de fases jogadas para o
 * usuário atual (assignPhasesToCurrentUser).
 *
 * @param {any} userSkill Documento UserSkillUp atualizado.
 * @returns {{ email: string, playedPhases: Array<any> }}
 */
export function toPlayedPhasesAssignmentDto(userSkill) {
  const playedPhases = (userSkill.playedPhases || []).map(entry => ({
    phaseId: String(entry.phase),
    completed: !!entry.completed,
    score: typeof entry.score === 'number' ? entry.score : 0,
    starsEarned: typeof entry.starsEarned === 'number' ? entry.starsEarned : 0,
    datePlayed: entry.datePlayed || null
  }));

  return {
    email: userSkill.email,
    playedPhases
  };
}

/**
 * Monta o DTO de histórico de fases jogadas para um e-mail específico.
 *
 * @param {any} userSkill Documento UserSkillUp com playedPhases populado.
 * @returns {{ email: string, playedPhases: Array<any> }}
 */
export function toPlayedPhasesHistoryDto(userSkill) {
  const playedPhasesDocs = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases : [];

  const playedPhases = playedPhasesDocs.map(entry => {
    const hasPhaseDoc = entry.phase && entry.phase._id;
    const phaseDoc = hasPhaseDoc ? entry.phase : null;

    return {
      phaseId: String(phaseDoc ? phaseDoc._id : entry.phase),
      phaseName: phaseDoc ? phaseDoc.name : null,
      group: phaseDoc && typeof phaseDoc.group === 'number' ? phaseDoc.group : null,
      position: phaseDoc && typeof phaseDoc.position === 'number' ? phaseDoc.position : null,
      completed: !!entry.completed,
      score: typeof entry.score === 'number' ? entry.score : 0,
      starsEarned: typeof entry.starsEarned === 'number' ? entry.starsEarned : 0,
      datePlayed: entry.datePlayed || null
    };
  });

  return {
    email: userSkill.email,
    playedPhases
  };
}
