/**
 * Mapper responsável por montar o DTO de grupos de campanha
 * a partir das fases e do progresso do usuário.
 */

const GROUP_NAMES = {
  1: 'Aventura em Alto Mar',
  2: 'Jornada nas Montanhas',
  3: 'Expedição na Floresta',
  4: 'Viagem pelo Deserto',
  5: 'Mundo Subterrâneo'
};

/**
 * Constrói a lista de grupos de campanha com suas fases e progresso.
 *
 * @param {Array<any>} allPhases Lista de fases (lean docs).
 * @param {Array<any>} playedPhasesDocs Lista de entradas de playedPhases do usuário.
 * @returns {Array<any>} Array de grupos prontos para envio ao front.
 */
export function buildCampaignGroupsDto(allPhases, playedPhasesDocs) {
  const playedMap = new Map();
  playedPhasesDocs.forEach(p => {
    if (p.phase) playedMap.set(String(p.phase), p);
  });

  const groupsMap = new Map();

  [1, 2, 3, 4, 5].forEach(groupId => {
    groupsMap.set(groupId, {
      id: groupId,
      name: GROUP_NAMES[groupId] || `Grupo ${groupId}`,
      phases: []
    });
  });

  allPhases.forEach(phase => {
    const groupId = phase.group || 1;

    if (!groupsMap.has(groupId)) {
      groupsMap.set(groupId, {
        id: groupId,
        name: GROUP_NAMES[groupId] || `Grupo ${groupId}`,
        phases: []
      });
    }

    const group = groupsMap.get(groupId);
    const playedData = playedMap.get(String(phase._id));

    const playedPhaseObj = playedData
      ? {
          phaseId: String(phase._id),
          won: !!playedData.completed,
          starsEarned: typeof playedData.starsEarned === 'number' ? playedData.starsEarned : 0,
          score: typeof playedData.score === 'number' ? playedData.score : 0,
          datePlayed: playedData.datePlayed || null
        }
      : null;

    group.phases.push({
      id: String(phase._id),
      name: phase.name,
      isBossPhase: !!phase.isBossPhase,
      position: phase.position,
      playedPhase: playedPhaseObj
    });
  });

  return Array.from(groupsMap.values());
}
