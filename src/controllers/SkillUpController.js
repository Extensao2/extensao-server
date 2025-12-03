import SkillUpPhaseService from '../services/SkillUpPhaseService.js';
import SkillUpUserService from '../services/SkillUpUserService.js';
import SkillUpStoreService from '../services/SkillUpStoreService.js';
import SkillUpProgressService from '../services/SkillUpProgressService.js';
import { toQuestionDto } from '../mappers/SkillUpQuestionMapper.js';
import { toPhaseDetailDto, toSelectionModePhaseDto } from '../mappers/SkillUpPhaseMapper.js';
import { buildCampaignGroupsDto } from '../mappers/SkillUpCampaignMapper.js';
import { toPlayedPhasesAssignmentDto, toPlayedPhasesHistoryDto } from '../mappers/SkillUpProgressMapper.js';
import { toUserProfileDto } from '../mappers/SkillUpUserMapper.js';

class SkillUpController {
  
  /**
   * Verifica se o usuário já jogou fases suficientes para acessar
   * o modo de recomendação de fases.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async canAccessRecommendationMode(req, res) {
    try {
      const canAccess = await SkillUpUserService.canAccessRecommendationMode(req.user);

      return res.json({ data: { canAccess } });
    } catch (error) {
      console.error('Error on /game-mode/can-access-recommendation-mode:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retorna os grupos de campanha com suas fases, incluindo dados
   * de progresso (playedPhase) do usuário atual.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getCampaignPhaseGroups(req, res) {
    try {
      const { allPhases, playedPhasesDocs } = await SkillUpPhaseService.getCampaignGroupsData(req.user);

      const result = buildCampaignGroupsDto(allPhases, playedPhasesDocs);
      return res.json({ data: result });

    } catch (error) {
      console.error('Error on /campaign/phase-groups:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retorna os detalhes de uma fase específica, incluindo informações
   * de progresso do usuário e a lista de questões associadas.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getPhaseDetail(req, res) {
    try {
      const phaseId = req.params.id;
      const { phase, questions, playedPhase } = await SkillUpPhaseService.getPhaseDetailData(req.user, phaseId);

      const questionsDto = questions.map(q => toQuestionDto(q));
      const phaseDto = toPhaseDetailDto(phase, questionsDto, playedPhase);

      return res.json({
        data: phaseDto
      });
    } catch (error) {
      if (error.message === 'PHASE_ID_REQUIRED') {
        return res.status(400).json({ error: 'phaseId is required' });
      }

      if (error.message === 'PHASE_NOT_FOUND') {
        return res.status(404).json({ error: 'Phase not found' });
      }

      console.error('Error on /skillup/phases/:id:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Registra ou atualiza o progresso do usuário em um conjunto de fases,
   * recebendo um array de objetos com phaseId, completed, score, etc.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async assignPhasesToCurrentUser(req, res) {
    try {
      const phasesInput = req.body && Array.isArray(req.body.phases) ? req.body.phases : null;
      const userSkill = await SkillUpProgressService.assignPhasesToUser(req.user, phasesInput);

      const data = toPlayedPhasesAssignmentDto(userSkill);

      return res.json({ data });
    } catch (error) {
      if (error.message === 'PHASES_ARRAY_REQUIRED') {
        return res.status(400).json({ error: 'phases array is required' });
      }

      if (error.message === 'AT_LEAST_ONE_PHASE_ID_REQUIRED') {
        return res.status(400).json({ error: 'At least one valid phaseId is required' });
      }

      if (error.message === 'INVALID_PHASE_IDS') {
        const invalidPhaseIds = error.invalidPhaseIds || [];
        return res.status(400).json({
          error: 'Some phaseIds do not exist',
          invalidPhaseIds
        });
      }

      console.error('Error on /skillup/user/me/played-phases assign:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retorna o histórico de fases jogadas para um e-mail específico,
   * incluindo metadados da fase (nome, grupo, posição).
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getPlayedPhasesByEmail(req, res) {
    try {
      const email = req.params.email || (req.query && req.query.email);
      try {
        const userSkill = await SkillUpProgressService.getPlayedPhasesByEmail(email);

        const data = toPlayedPhasesHistoryDto(userSkill);

        return res.json({ data });
      } catch (serviceError) {
        if (serviceError.message === 'EMAIL_REQUIRED') {
          return res.status(400).json({ error: 'email is required' });
        }

        if (serviceError.message === 'USER_NOT_FOUND') {
          return res.status(404).json({ error: 'User not found' });
        }

        throw serviceError;
      }
    } catch (error) {
      console.error('Error on /skillup/user/played-phases:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Lista todos os produtos disponíveis na loja do SkillUp.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getProducts(req, res) {
    try {
      const products = await SkillUpStoreService.listProducts();
      return res.json({ data: products });
    } catch (error) {
      console.error('Error on /skillup/products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retorna até 10 questões únicas para o modo de seleção, com base
   * na matéria informada (ENUM MATH, LANGUAGES, SCIENCE, HISTORY).
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getSelectionModePhase(req, res) {
    try {
      const rawMateria = req.params.materia;
      const { subjectId, category, questions } = await SkillUpPhaseService.getSelectionModePhaseData(rawMateria);

      const questionsDto = questions.map(q => toQuestionDto(q));
      const phaseDto = toSelectionModePhaseDto(subjectId, category, questionsDto);

      return res.json({
        data: phaseDto
      });
    } catch (error) {
      if (error.message === 'INVALID_SUBJECT_ID') {
        return res.status(400).json({ error: 'Invalid subject id' });
      }

      if (error.message === 'NO_QUESTIONS_FOR_SUBJECT') {
        return res.status(404).json({ error: 'No questions found for this subject' });
      }

      console.error('Error on /skillup/selection-mode/phases/:materia:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Permite que o usuário compre um produto, debitando moedas e
   * adicionando o item à lista de itens possuídos.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async buyProduct(req, res) {
    try {
      const productId = req.body && req.body.productId;
      try {
        const userSkill = await SkillUpStoreService.buyProduct(req.user, productId);

        return res.json({ data: userSkill });
      } catch (serviceError) {
        if (serviceError.message === 'PRODUCT_ID_REQUIRED') {
          return res.status(400).json({ error: 'productId is required' });
        }

        if (serviceError.message === 'PRODUCT_NOT_FOUND') {
          return res.status(404).json({ error: 'Product not found' });
        }

        if (serviceError.message === 'ALREADY_OWNS_PRODUCT') {
          return res.status(400).json({ error: 'You already own this product' });
        }

        if (serviceError.message === 'NOT_ENOUGH_COINS') {
          return res.status(400).json({ error: 'Not enough coins' });
        }

        throw serviceError;
      }
    } catch (error) {
      console.error('Error on /skillup/user/me/buy-product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Equipa um item previamente comprado pelo usuário, garantindo que
   * ele possua o item e que ainda não esteja equipado.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async equipItem(req, res) {
    try {
      const itemId = req.body && req.body.itemId;
      try {
        const userSkill = await SkillUpStoreService.equipItem(req.user, itemId);

        return res.json({ data: userSkill });
      } catch (serviceError) {
        if (serviceError.message === 'ITEM_ID_REQUIRED') {
          return res.status(400).json({ error: 'itemId is required' });
        }

        if (serviceError.message === 'PRODUCT_NOT_FOUND') {
          return res.status(404).json({ error: 'Product not found' });
        }

        if (serviceError.message === 'ITEM_NOT_OWNED') {
          return res.status(400).json({ error: 'You do not own this item' });
        }

        if (serviceError.message === 'ITEM_ALREADY_EQUIPPED') {
          return res.status(400).json({ error: 'Item already equipped' });
        }

        throw serviceError;
      }
    } catch (error) {
      console.error('Error on /skillup/user/me/equip-item:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retorna o perfil SkillUp do usuário atual (moedas, vidas, pontos
   * por matéria, itens equipados, datas de criação/atualização).
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getUserMe(req, res) {
    try {
      const { userSkill, equippedItemsDocs } = await SkillUpUserService.getUserSkillWithEquippedItems(req.user);

      const profileDto = toUserProfileDto(req.user, userSkill, equippedItemsDocs);

      return res.json({
        data: profileDto
      });
    } catch (error) {
      console.error('Error on /user/me:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handler de callback de autenticação do SkillUp, atualmente
   * responsável apenas por redirecionar para /login.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  authSkillupCallback(req, res) {
    try{
      return res.redirect('/login');
    }
    catch(error){
      console.error('Error on /skillup/auth/callback:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new SkillUpController();