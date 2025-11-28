import { Router } from 'express';
import QuestaoController from '../controllers/QuestaoController.js';

const router = Router();

router.get('/questoes', (req, res) => QuestaoController.listar(req, res));

export default router;
