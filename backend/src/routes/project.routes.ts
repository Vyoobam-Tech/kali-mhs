import { Router } from 'express';
import { ProjectController } from '@controllers/project.controller';
import { validate } from '@middlewares/validate';
import { authenticate, isAdminOrAbove } from '@middlewares/auth';
import {
    createProjectSchema,
    updateProjectSchema,
    getProjectByIdSchema,
    getProjectBySlugSchema,
    getProjectsQuerySchema,
    addProjectImageSchema,
    removeProjectImageSchema,
    addProductToProjectSchema,
    searchProjectsSchema,
    publishProjectSchema,
} from '@validations/project.validation';

const router = Router();

/**
 * Public Routes
 */

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects with pagination and filtering
 * @access  Public
 */
router.get('/', validate(getProjectsQuerySchema), ProjectController.getAllProjects);

/**
 * @route   GET /api/v1/projects/featured
 * @desc    Get featured projects
 * @access  Public
 */
router.get('/featured', ProjectController.getFeaturedProjects);

/**
 * @route   GET /api/v1/projects/completed
 * @desc    Get completed projects
 * @access  Public
 */
router.get('/completed', ProjectController.getCompletedProjects);

/**
 * @route   GET /api/v1/projects/search
 * @desc    Search projects
 * @access  Public
 */
router.get('/search', validate(searchProjectsSchema), ProjectController.searchProjects);

/**
 * @route   GET /api/v1/projects/category/:category
 * @desc    Get projects by category
 * @access  Public
 */
router.get('/category/:category', ProjectController.getProjectsByCategory);

/**
 * @route   GET /api/v1/projects/slug/:slug
 * @desc    Get project by slug
 * @access  Public
 */
router.get(
    '/slug/:slug',
    validate(getProjectBySlugSchema),
    ProjectController.getProjectBySlug
);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/:id', validate(getProjectByIdSchema), ProjectController.getProjectById);

/**
 * Protected Routes (Admin & above)
 */

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/',
    authenticate,
    isAdminOrAbove,
    validate(createProjectSchema),
    ProjectController.createProject
);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private (Admin, Super Admin)
 */
router.put(
    '/:id',
    authenticate,
    isAdminOrAbove,
    validate(updateProjectSchema),
    ProjectController.updateProject
);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project (soft delete)
 * @access  Private (Admin, Super Admin)
 */
router.delete(
    '/:id',
    authenticate,
    isAdminOrAbove,
    validate(getProjectByIdSchema),
    ProjectController.deleteProject
);

/**
 * @route   POST /api/v1/projects/:id/images
 * @desc    Add image to project
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/images',
    authenticate,
    isAdminOrAbove,
    validate(addProjectImageSchema),
    ProjectController.addProjectImage
);

/**
 * @route   DELETE /api/v1/projects/:id/images
 * @desc    Remove image from project
 * @access  Private (Admin, Super Admin)
 */
router.delete(
    '/:id/images',
    authenticate,
    isAdminOrAbove,
    validate(removeProjectImageSchema),
    ProjectController.removeProjectImage
);

/**
 * @route   POST /api/v1/projects/:id/products
 * @desc    Add product to project
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/products',
    authenticate,
    isAdminOrAbove,
    validate(addProductToProjectSchema),
    ProjectController.addProductToProject
);

/**
 * @route   POST /api/v1/projects/:id/publish
 * @desc    Publish project
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/publish',
    authenticate,
    isAdminOrAbove,
    validate(publishProjectSchema),
    ProjectController.publishProject
);

export { router };
