import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { validateBody } from '@/middleware/validation';
import { loginSchema } from '@/utils/validation';

const router = Router();

router.post('/login', validateBody(loginSchema), AuthController.login);

export default router;