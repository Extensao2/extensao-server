/**
 * Funções de mapeamento de Phase e estruturas relacionadas
 * para os DTOs usados pelo módulo SkillUp.
 */

/**
 * DTO de detalhes de fase de campanha.
 * @param {any} phase Documento plain/lean de Phase.
 * @param {Array<any>} questions DTOs de questões já mapeadas.
 * @param {any|null} playedPhase Informações de progresso do usuário na fase.
 * @returns {any}
 */
export function toPhaseDetailDto(phase, questions, playedPhase) {
  return {
    id: String(phase._id),
    name: phase.name,
    isBossPhase: !!phase.isBossPhase,
    position: phase.position,
    questions,
    phaseGroup: typeof phase.group === 'number' ? phase.group : null,
    playedPhase
  };
}

/**
 * DTO da "fase" usada no modo seleção (Selection Mode).
 * @param {number} subjectId Código numérico da matéria (ENUM front).
 * @param {string} category Nome da categoria (MATH, SCIENCE, etc.).
 * @param {Array<any>} questions DTOs de questões já mapeadas.
 * @returns {any}
 */
export function toSelectionModePhaseDto(subjectId, category, questions) {
  return {
    id: subjectId,
    name: `${category} Selection Phase`,
    isBossPhase: false,
    position: 1,
    questions,
    phaseGroup: null
  };
}
