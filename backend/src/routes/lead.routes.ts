import { Router } from 'express';
import { LeadController } from '@controllers/lead.controller';
import { validate } from '@middlewares/validate';
import { authenticate, isAdminOrAbove } from '@middlewares/auth';
import {
    createLeadSchema,
    updateLeadSchema,
    getLeadsQuerySchema,
    addActivitySchema,
    assignLeadSchema,
    convertLeadSchema,
} from '@validations/lead.validation';

const router = Router();

// Public - Lead submission (contact forms)
router.post('/', validate(createLeadSchema), LeadController.createLead);

// Protected - Admin & Sales
router.get('/', authenticate, validate(getLeadsQuerySchema), LeadController.getAllLeads);
router.get('/my-leads', authenticate, LeadController.getMyLeads);
router.get('/stats', authenticate, isAdminOrAbove, LeadController.getLeadStats);
router.get('/:id', authenticate, isAdminOrAbove, LeadController.getLeadById);
router.put('/:id', authenticate, isAdminOrAbove, validate(updateLeadSchema), LeadController.updateLead);
router.delete('/:id', authenticate, isAdminOrAbove, LeadController.deleteLead);
router.post('/:id/assign', authenticate, isAdminOrAbove, validate(assignLeadSchema), LeadController.assignLead);
router.post('/:id/convert', authenticate, isAdminOrAbove, validate(convertLeadSchema), LeadController.convertLead);
router.post('/:id/activities', authenticate, validate(addActivitySchema), LeadController.addActivity);
router.get('/:id/activities', authenticate, LeadController.getLeadActivities);

export { router };
