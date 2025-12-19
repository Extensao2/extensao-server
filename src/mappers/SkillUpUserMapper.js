/**
 * Mappers para o perfil SkillUp do usuário.
 */

const RARITY_MAP = {
  common: 'COMMON',
  rare: 'RARE',
  legendary: 'LEGENDARY'
};

/**
 * Converte um documento de Product equipado em DTO para o front.
 *
 * @param {any} item Documento de produto equipado.
 * @returns {{ id: string, name: string, imageUrl: string, price: number, type: string, rarity: string }}
 */
export function toEquippedItemDto(item) {
  return {
    id: String(item._id),
    name: item.name,
    imageUrl: item.url || '',
    price: item.price,
    type: item.type,
    rarity: RARITY_MAP[item.rarity] || item.rarity
  };
}

/**
 * Monta o DTO de perfil do usuário SkillUp.
 *
 * @param {{ _id: any }} reqUser Objeto req.user vindo do Express.
 * @param {any} userSkill Documento UserSkillUp.
 * @param {Array<any>} equippedItemsDocs Lista de itens equipados.
 * @returns {any}
 */
export function toUserProfileDto(reqUser, userSkill, equippedItemsDocs) {
  const equippedItems = (equippedItemsDocs || []).map(item => toEquippedItemDto(item));

  return {
    id: String(reqUser._id),
    name: userSkill.name,
    email: userSkill.email,
    coins: userSkill.coins,
    lifesRemaining: userSkill.lifesRemaining,
    lifeLostAt: userSkill.lifeLostAt,
    lifeRecoveredAt: userSkill.lifeRecoveredAt,
    mathSkillPoints: userSkill.mathSkillPoints,
    languageSkillPoints: userSkill.languageSkillPoints,
    scienceSkillPoints: userSkill.scienceSkillPoints,
    historySkillPoints: userSkill.historySkillPoints,
    equippedItems,
    createdAt: userSkill.createdAt,
    updatedAt: userSkill.updatedAt
  };
}
