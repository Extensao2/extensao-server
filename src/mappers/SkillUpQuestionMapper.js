/**
 * Funções de mapeamento de Question para o DTO usado pelo SkillUp.
 */

/**
 * Converte um documento de Question em DTO para o front.
 * @param {any} question Documento plain/lean de Question.
 * @returns {{id: string, description: string, options: string[], subject: string, topic: string | null}}
 */
export function toQuestionDto(question) {
  return {
    id: String(question._id),
    description: question.statement,
    options: Array.isArray(question.options) ? question.options : [],
    subject: question.category,
    topic: question.topic || null
  };
}
