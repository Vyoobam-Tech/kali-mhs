import { ProjectModel, IProjectDocument } from '@infrastructure/database/models/Project.model';
import {
    ICreateProject,
    IUpdateProject,
    IProject,
    ProjectCategory,
    ProjectStatus,
} from '@domain/project.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * Project Use Cases
 * Business logic for project/portfolio management
 */
export class ProjectUseCases {
    /**
     * Create a new project
     */
    static async createProject(projectData: ICreateProject): Promise<IProject> {
        // Generate slug from title
        const slug = this.generateSlug(projectData.title);

        // Check if slug already exists
        const existingProject = await ProjectModel.findBySlug(slug);
        if (existingProject) {
            throw new AppError(409, 'A project with this title already exists');
        }

        const project = new ProjectModel({
            ...projectData,
            slug,
            status: ProjectStatus.DRAFT,
            viewCount: 0,
            images: [],
            videos: [],
            productsUsed: [],
            tags: projectData.tags || [],
            isDeleted: false,
        });

        await project.save();
        return this.toProjectResponse(project);
    }

    /**
     * Get all projects with pagination and filtering
     */
    static async getAllProjects(
        page: number = 1,
        limit: number = 20,
        category?: ProjectCategory,
        status?: ProjectStatus,
        isFeatured?: boolean,
        searchQuery?: string
    ): Promise<{ projects: IProject[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = { isDeleted: false };
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (isFeatured !== undefined) filter.isFeatured = isFeatured;
        if (searchQuery) {
            filter.$text = { $search: searchQuery };
        }

        // Get projects and total count
        const [projects, total] = await Promise.all([
            ProjectModel.find(filter)
                .sort(searchQuery ? { score: { $meta: 'textScore' } } : { completionDate: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'firstName lastName email')
                .populate('productsUsed.product', 'name slug'),
            ProjectModel.countDocuments(filter),
        ]);

        return {
            projects: projects.map((p) => this.toProjectResponse(p)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get project by ID
     */
    static async getProjectById(projectId: string): Promise<IProject> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        })
            .populate('createdBy', 'firstName lastName email')
            .populate('productsUsed.product', 'name slug category');

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        // Increment view count
        project.viewCount += 1;
        await project.save();

        return this.toProjectResponse(project);
    }

    /**
     * Get project by slug
     */
    static async getProjectBySlug(slug: string): Promise<IProject> {
        const project = await ProjectModel.findBySlug(slug);

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        // Populate references
        await project.populate('productsUsed.product', 'name slug category');

        // Increment view count
        project.viewCount += 1;
        await project.save();

        return this.toProjectResponse(project);
    }

    /**
     * Update project
     */
    static async updateProject(projectId: string, updateData: IUpdateProject): Promise<IProject> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        });

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        // Update fields
        if (updateData.title) {
            project.title = updateData.title;
            project.slug = this.generateSlug(updateData.title);
        }
        if (updateData.shortDescription !== undefined)
            project.shortDescription = updateData.shortDescription;
        if (updateData.fullDescription !== undefined)
            project.fullDescription = updateData.fullDescription;
        if (updateData.category) project.category = updateData.category;
        if (updateData.status) project.status = updateData.status;
        if (updateData.location) project.location = updateData.location as any;
        if (updateData.startDate !== undefined) project.startDate = updateData.startDate;
        if (updateData.completionDate !== undefined) project.completionDate = updateData.completionDate;
        if (updateData.isFeatured !== undefined) project.isFeatured = updateData.isFeatured;
        if (updateData.displayOnHomepage !== undefined)
            project.displayOnHomepage = updateData.displayOnHomepage;
        if (updateData.tags) project.tags = updateData.tags;
        if (updateData.updatedBy) project.updatedBy = updateData.updatedBy as any;

        await project.save();
        return this.toProjectResponse(project);
    }

    /**
     * Delete project (soft delete)
     */
    static async deleteProject(projectId: string, deletedBy: string): Promise<void> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        });

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        project.isDeleted = true;
        project.updatedBy = deletedBy as any;
        await project.save();
    }

    /**
     * Get projects by category
     */
    static async getProjectsByCategory(category: ProjectCategory): Promise<IProject[]> {
        const projects = await ProjectModel.findByCategory(category);
        return projects.map((p) => this.toProjectResponse(p));
    }

    /**
     * Get featured projects
     */
    static async getFeaturedProjects(limit: number = 10): Promise<IProject[]> {
        const projects = await ProjectModel.findFeatured();
        const limitedProjects = projects.slice(0, limit);
        return limitedProjects.map((p: any) => this.toProjectResponse(p));
    }

    /**
     * Get completed projects
     */
    static async getCompletedProjects(limit: number = 50): Promise<IProject[]> {
        const projects = await ProjectModel.findCompleted();
        const limitedProjects = projects.slice(0, limit);
        return limitedProjects.map((p: any) => this.toProjectResponse(p));
    }

    /**
     * Add image to project
     */
    static async addProjectImage(
        projectId: string,
        image: { url: string; caption?: string; order?: number },
        updatedBy: string
    ): Promise<IProject> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        });

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        project.images.push(image as any);
        project.updatedBy = updatedBy as any;
        await project.save();

        return this.toProjectResponse(project);
    }

    /**
     * Remove image from project
     */
    static async removeProjectImage(
        projectId: string,
        imageUrl: string,
        updatedBy: string
    ): Promise<IProject> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        });

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        project.images = project.images.filter((img) => img.url !== imageUrl);
        project.updatedBy = updatedBy as any;
        await project.save();

        return this.toProjectResponse(project);
    }

    /**
     * Add product to project
     */
    static async addProductToProject(
        projectId: string,
        productData: { product: string; productName: string; quantity?: number; unit?: string; notes?: string },
        updatedBy: string
    ): Promise<IProject> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        });

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        project.productsUsed.push(productData as any);
        project.updatedBy = updatedBy as any;
        await project.save();

        return this.toProjectResponse(project);
    }

    /**
     * Publish project
     */
    static async publishProject(projectId: string, publishedBy: string): Promise<IProject> {
        const project = await ProjectModel.findOne({
            _id: projectId,
            isDeleted: false,
        });

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        project.status = ProjectStatus.COMPLETED;
        project.publishedAt = new Date();
        project.publishedBy = publishedBy as any;
        project.updatedBy = publishedBy as any;

        await project.save();
        return this.toProjectResponse(project);
    }

    /**
     * Search projects
     */
    static async searchProjects(query: string, limit: number = 10): Promise<IProject[]> {
        const projects = await ProjectModel.find({
            $text: { $search: query },
            status: ProjectStatus.COMPLETED,
            isDeleted: false,
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit);

        return projects.map((p) => this.toProjectResponse(p));
    }

    /**
     * Generate slug from project title
     */
    private static generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Convert Project document to response DTO
     */
    private static toProjectResponse(project: IProjectDocument): IProject {
        return project.toJSON() as IProject;
    }
}
