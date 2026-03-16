import { Request, Response } from 'express';
import { ProjectUseCases } from '@usecases/project.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { ProjectCategory, ProjectStatus } from '@domain/project.interface';

/**
 * Project Controller
 * Handles HTTP requests for project/portfolio endpoints
 */
export class ProjectController {
    /**
     * Create a new project
     * POST /api/v1/projects
     */
    static createProject = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const projectData = {
            ...req.body,
            createdBy: req.user.userId,
        };

        const project = await ProjectUseCases.createProject(projectData);

        res.status(201).json({
            status: 'success',
            message: 'Project created successfully',
            data: { project },
        });
    });

    /**
     * Get all projects with pagination and filtering
     * GET /api/v1/projects
     */
    static getAllProjects = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, category, status, isFeatured, search } = req.query;

        const result = await ProjectUseCases.getAllProjects(
            page ? parseInt(page as string, 10) : 1,
            limit ? parseInt(limit as string, 10) : 20,
            category as ProjectCategory,
            status as ProjectStatus,
            isFeatured === 'true' ? true : undefined,
            search as string
        );

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * Get project by ID
     * GET /api/v1/projects/:id
     */
    static getProjectById = asyncHandler(async (req: Request, res: Response) => {
        const project = await ProjectUseCases.getProjectById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { project },
        });
    });

    /**
     * Get project by slug
     * GET /api/v1/projects/slug/:slug
     */
    static getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
        const project = await ProjectUseCases.getProjectBySlug(req.params.slug);

        res.status(200).json({
            status: 'success',
            data: { project },
        });
    });

    /**
     * Update project
     * PUT /api/v1/projects/:id
     */
    static updateProject = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user.userId,
        };

        const project = await ProjectUseCases.updateProject(req.params.id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Project updated successfully',
            data: { project },
        });
    });

    /**
     * Delete project (soft delete)
     * DELETE /api/v1/projects/:id
     */
    static deleteProject = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        await ProjectUseCases.deleteProject(req.params.id, req.user.userId);

        res.status(200).json({
            status: 'success',
            message: 'Project deleted successfully',
        });
    });

    /**
     * Get projects by category
     * GET /api/v1/projects/category/:category
     */
    static getProjectsByCategory = asyncHandler(async (req: Request, res: Response) => {
        const projects = await ProjectUseCases.getProjectsByCategory(
            req.params.category as ProjectCategory
        );

        res.status(200).json({
            status: 'success',
            data: { projects },
        });
    });

    /**
     * Get featured projects
     * GET /api/v1/projects/featured
     */
    static getFeaturedProjects = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const projects = await ProjectUseCases.getFeaturedProjects(limit);

        res.status(200).json({
            status: 'success',
            data: { projects },
        });
    });

    /**
     * Get completed projects
     * GET /api/v1/projects/completed
     */
    static getCompletedProjects = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
        const projects = await ProjectUseCases.getCompletedProjects(limit);

        res.status(200).json({
            status: 'success',
            data: { projects },
        });
    });

    /**
     * Add image to project
     * POST /api/v1/projects/:id/images
     */
    static addProjectImage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const project = await ProjectUseCases.addProjectImage(
            req.params.id,
            req.body,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Image added successfully',
            data: { project },
        });
    });

    /**
     * Remove image from project
     * DELETE /api/v1/projects/:id/images
     */
    static removeProjectImage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const project = await ProjectUseCases.removeProjectImage(
            req.params.id,
            req.body.imageUrl,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Image removed successfully',
            data: { project },
        });
    });

    /**
     * Add product to project
     * POST /api/v1/projects/:id/products
     */
    static addProductToProject = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const project = await ProjectUseCases.addProductToProject(
            req.params.id,
            req.body,
            req.user.userId
        );

        res.status(200).json({
            status: 'success',
            message: 'Product added to project successfully',
            data: { project },
        });
    });

    /**
     * Publish project
     * POST /api/v1/projects/:id/publish
     */
    static publishProject = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }

        const project = await ProjectUseCases.publishProject(req.params.id, req.user.userId);

        res.status(200).json({
            status: 'success',
            message: 'Project published successfully',
            data: { project },
        });
    });

    /**
     * Search projects
     * GET /api/v1/projects/search
     */
    static searchProjects = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query.q as string;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const projects = await ProjectUseCases.searchProjects(query, limit);

        res.status(200).json({
            status: 'success',
            data: { projects },
        });
    });
}
