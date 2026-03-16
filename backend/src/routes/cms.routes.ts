import { Router } from 'express';
import { CMSController } from '@controllers/cms.controller';
import { validate } from '@middlewares/validate';
import { authenticate, isAdminOrAbove } from '@middlewares/auth';
import {
    createCMSPageSchema,
    updateCMSPageSchema,
    getCMSPagesQuerySchema,
} from '@validations/cms.validation';

const router = Router();

// Public
router.get('/', validate(getCMSPagesQuerySchema), CMSController.getAllPages);
router.get('/published', CMSController.getPublishedPages);
router.get('/slug/:slug', CMSController.getPageBySlug);
router.get('/:id', CMSController.getPageById);

// Protected
router.post('/', authenticate, isAdminOrAbove, validate(createCMSPageSchema), CMSController.createPage);
router.put('/:id', authenticate, isAdminOrAbove, validate(updateCMSPageSchema), CMSController.updatePage);
router.delete('/:id', authenticate, isAdminOrAbove, CMSController.deletePage);
router.post('/:id/publish', authenticate, isAdminOrAbove, CMSController.publishPage);

export { router };
