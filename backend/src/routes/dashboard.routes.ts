import { Router } from 'express';
import { authenticate, isAdminOrAbove } from '@middlewares/auth';
import { getStats } from '@controllers/dashboard.controller';

const router = Router();

router.get('/stats', authenticate, isAdminOrAbove, getStats);

export { router };
