import UserSkillUp from '../models/UserSkillUp.js';

/**
 * Service responsável por operações relacionadas ao usuário SkillUp
 * (documento UserSkillUp, regeneração de vidas, perfil, etc.).
 */
class SkillUpUserService {
  /**
   * Busca o documento UserSkillUp associado ao usuário ou cria um novo
   * registro com valores padrão caso ainda não exista.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado (req.user).
   * @returns {Promise<any>} Documento UserSkillUp correspondente.
   */
  async getOrCreateUserSkillUp(user) {
    let userSkill = await UserSkillUp.findOne({ email: user.email });

    if (!userSkill) {
      userSkill = new UserSkillUp({
        name: user.name,
        email: user.email,
        coins: 0,
        lifesRemaining: 5
      });
      await userSkill.save();
    }

    return userSkill;
  }

  /**
   * Aplica a lógica de regeneração de vidas para o usuário, com base
   * no tempo decorrido desde a última perda de vida.
   *
   * @param {any} userSkill Documento UserSkillUp do usuário.
   * @returns {{ userSkill: any, modified: boolean }} Documento possivelmente
   *          modificado e flag indicando se houve alteração.
   */
  applyLifeRegeneration(userSkill) {
    const maxLives = 5;
    const intervalMs = 10 * 60 * 1000;
    const now = new Date();
    let modified = false;

    if (userSkill.lifesRemaining >= maxLives) {
      if (userSkill.lifeLostAt) {
        userSkill.lifeLostAt = null;
        modified = true;
      }
      return { userSkill, modified };
    }

    if (!userSkill.lifeLostAt) {
      userSkill.lifeLostAt = now;
      modified = true;
      return { userSkill, modified };
    }

    const diffMs = now - userSkill.lifeLostAt;
    if (diffMs < intervalMs) {
      return { userSkill, modified };
    }

    const intervals = Math.floor(diffMs / intervalMs);
    if (intervals <= 0) {
      return { userSkill, modified };
    }

    const livesToRecover = Math.min(intervals, maxLives - userSkill.lifesRemaining);
    if (livesToRecover <= 0) {
      return { userSkill, modified };
    }

    userSkill.lifesRemaining += livesToRecover;
    if (userSkill.lifesRemaining >= maxLives) {
      userSkill.lifesRemaining = maxLives;
      userSkill.lifeLostAt = null;
    } else {
      const remainder = diffMs % intervalMs;
      userSkill.lifeLostAt = new Date(now - remainder);
    }

    modified = true;
    return { userSkill, modified };
  }

  /**
   * Carrega o documento UserSkillUp com os itens equipados, garantindo
   * criação de registro e regeneração de vidas.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado (req.user).
   * @returns {Promise<{ userSkill: any, equippedItemsDocs: any[] }>}
   */
  async getUserSkillWithEquippedItems(user) {
    let userSkill = await UserSkillUp.findOne({ email: user.email }).populate('equippedItems');

    if (!userSkill) {
      userSkill = new UserSkillUp({
        name: user.name || user.email,
        email: user.email,
        coins: 0,
        lifesRemaining: 5
      });
    }

    const { modified } = this.applyLifeRegeneration(userSkill);

    if (userSkill.isNew || modified) {
      await userSkill.save();
    }

    const equippedItemsDocs = Array.isArray(userSkill.equippedItems) ? userSkill.equippedItems : [];

    return { userSkill, equippedItemsDocs };
  }

  /**
   * Verifica se o usuário pode acessar o modo de recomendação com base
   * na quantidade de fases jogadas.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @returns {Promise<boolean>} true se pode acessar, false caso contrário.
   */
  async canAccessRecommendationMode(user) {
    const userSkill = await this.getOrCreateUserSkillUp(user);
    const playedCount = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases.length : 0;
    return playedCount >= 10;
  }

  /**
   * Incrementa em 1 a quantidade de vidas do usuário autenticado,
   * respeitando o limite máximo de vidas.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @param {number} [maxLives=5] Limite máximo de vidas permitidas.
   * @returns {Promise<any>} Documento UserSkillUp atualizado.
   */
  async addLifeToUser(user, maxLives = 5) {
    const userSkill = await this.getOrCreateUserSkillUp(user);

    if (typeof userSkill.lifesRemaining !== 'number') {
      userSkill.lifesRemaining = 0;
    }

    if (userSkill.lifesRemaining < maxLives) {
      userSkill.lifesRemaining += 1;
      userSkill.lifeLostAt = null;
      userSkill.lifeRecoveredAt = new Date();
      await userSkill.save();
    }

    return userSkill;
  }
}

export default new SkillUpUserService();
