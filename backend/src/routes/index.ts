import { Router } from 'express';
import { router as authRouter } from './auth.routes';
import { router as productRouter } from './product.routes';
import { router as rfqRouter } from './rfq.routes';
import { router as documentRouter } from './document.routes';
import { router as projectRouter } from './project.routes';
import { router as careerRouter } from './career.routes';
import { router as leadRouter } from './lead.routes';
import { router as cmsRouter } from './cms.routes';
import { router as auditRouter } from './audit.routes';
import { router as dashboardRouter } from './dashboard.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/rfq', rfqRouter);
router.use('/documents', documentRouter);
router.use('/projects', projectRouter);
router.use('/careers', careerRouter);
router.use('/leads', leadRouter);
router.use('/cms', cmsRouter);
router.use('/audit', auditRouter);
router.use('/dashboard', dashboardRouter);

export { router };
