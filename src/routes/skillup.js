import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import SkillUpController from '../controllers/SkillUpController.js';


/**
 * Router responsável pelas rotas relacionadas ao módulo SkillUp
 * (produtos, fases de campanha, progresso do usuário e modo seleção).
 *
 * @type {import('express').Router}
 */
const router = express.Router();

router.get(
  '/skillup/products',
  (req, res) => SkillUpController.getProducts(req, res)
);

router.post(
  '/skillup/user/me/equip-item',
  requireAuth,
  (req, res) => SkillUpController.equipItem(req, res)
);

router.post(
  '/skillup/user/me/unequip-item',
  requireAuth,
  (req, res) => SkillUpController.unequipItem(req, res)
);

router.post(
  '/skillup/user/me/buy-product',
  requireAuth,
  (req, res) => SkillUpController.buyProduct(req, res)
);

router.get(
  '/skillup/game-mode/can-access-recommendation-mode',
  requireAuth,
  (req, res) => SkillUpController.canAccessRecommendationMode(req, res)
);

router.get(
  '/skillup/recommendation-mode/phases',
  requireAuth,
  (req, res) => SkillUpController.getRecommendationModePhases(req, res)
);

router.get(
  '/skillup/campaign/phase-groups',
  requireAuth,
  (req, res) => SkillUpController.getCampaignPhaseGroups(req, res)
);

router.get(
  '/skillup/phases/:id',
  requireAuth,
  (req, res) => SkillUpController.getPhaseDetail(req, res)
);

router.get(
  '/skillup/selection-mode/phases/:materia',
  requireAuth,
  (req, res) => SkillUpController.getSelectionModePhase(req, res)
);

router.post(
  '/skillup/user/me/played-phases',
  requireAuth,
  (req, res) => SkillUpController.assignPhasesToCurrentUser(req, res)
);

router.post(
  '/skillup/user/me/add-life',
  requireAuth,
  (req, res) => SkillUpController.addLifeToCurrentUser(req, res)
);

router.get(
  '/skillup/user/played-phases/:email',
  requireAuth,
  (req, res) => SkillUpController.getPlayedPhasesByEmail(req, res)
);

router.get(
  '/skillup/user/me',
  requireAuth,
  (req, res) => SkillUpController.getUserMe(req, res)
);

router.get(
  '/skillup/user/me/owned-items',
  requireAuth,
  (req, res) => SkillUpController.getOwnedItems(req, res)
);

router.get(
  '/skillup/user/me/equipped-items',
  requireAuth,
  (req, res) => SkillUpController.getEquippedItems(req, res)
);

export default router;
