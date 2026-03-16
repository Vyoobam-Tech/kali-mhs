import { Router } from 'express';
import { CareerController } from '@controllers/career.controller';
import { validate } from '@middlewares/validate';
import { authenticate, isAdminOrAbove } from '@middlewares/auth';
import { uploadResume, handleUploadError } from '@middlewares/upload';
import {
    createJobSchema,
    updateJobSchema,
    getJobByIdSchema,
    getJobBySlugSchema,
    getJobsQuerySchema,
    submitApplicationSchema,
    updateApplicationStatusSchema,
    getApplicationsQuerySchema,
} from '@validations/career.validation';

const router = Router();

// ── Public Job Routes ─────────────────────────────────────────
router.get('/', validate(getJobsQuerySchema), CareerController.getAllJobs);
router.get('/active', CareerController.getActiveJobs);
router.get('/slug/:slug', validate(getJobBySlugSchema), CareerController.getJobBySlug);

// ── Protected Application Routes (Admin) — MUST be before /:id wildcard ─────────────────────
router.get('/applications/all', authenticate, isAdminOrAbove, validate(getApplicationsQuerySchema), CareerController.getAllApplications);
router.get('/applications/:id', authenticate, isAdminOrAbove, validate(getJobByIdSchema), CareerController.getApplicationById);
router.put('/applications/:id/status', authenticate, isAdminOrAbove, validate(updateApplicationStatusSchema), CareerController.updateApplicationStatus);
router.post('/applications/:id/score', authenticate, isAdminOrAbove, CareerController.scoreApplication);
router.post('/applications/:id/notes', authenticate, isAdminOrAbove, CareerController.addApplicationNote);

// ── Public Application Route ──────────────────────────────────
// Resume upload via multer → handleUploadError → validate → controller
router.post(
    '/applications',
    uploadResume,
    handleUploadError,
    validate(submitApplicationSchema),
    CareerController.submitApplication
);

// ── Public Job by ID (after all named routes to avoid shadowing) ────
router.get('/:id', validate(getJobByIdSchema), CareerController.getJobById);

// ── Protected Job Routes (Admin) ──────────────────────────────
router.post('/', authenticate, isAdminOrAbove, validate(createJobSchema), CareerController.createJob);
router.put('/:id', authenticate, isAdminOrAbove, validate(updateJobSchema), CareerController.updateJob);
router.delete('/:id', authenticate, isAdminOrAbove, validate(getJobByIdSchema), CareerController.deleteJob);
router.post('/:id/publish', authenticate, isAdminOrAbove, validate(getJobByIdSchema), CareerController.publishJob);

export { router };
