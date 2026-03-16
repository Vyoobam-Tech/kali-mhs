import { Router } from 'express';
import { AuditController } from '@controllers/audit.controller';
import { validate } from '@middlewares/validate';
import { authenticate, isSuperAdmin } from '@middlewares/auth';
import { getAuditLogsQuerySchema } from '@validations/audit.validation';

const router = Router();

// All audit routes require Super Admin access
router.get('/', authenticate, isSuperAdmin, validate(getAuditLogsQuerySchema), AuditController.getAuditLogs);
router.get('/high-risk', authenticate, isSuperAdmin, AuditController.getHighRiskActivities);
router.get('/stats', authenticate, isSuperAdmin, AuditController.getAuditStats);
router.get('/:id', authenticate, isSuperAdmin, AuditController.getAuditLogById);

export { router };
