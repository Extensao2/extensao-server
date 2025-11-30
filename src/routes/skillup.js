import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import SkillUpController from '../controllers/SkillUpController.js';

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
  '/skillup/campaign/phase-groups',
  requireAuth,
  (req, res) => SkillUpController.getCampaignPhaseGroups(req, res)
);

router.post(
  '/skillup/user/me/played-phases',
  requireAuth,
  (req, res) => SkillUpController.assignPhasesToCurrentUser(req, res)
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
  '/skillup/auth/callback',
  (req, res) => SkillUpController.authSkillupCallback(req, res)
);

export default router;
