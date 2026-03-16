import { Request, Response } from 'express';
import { CMSUseCases } from '@usecases/cms.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { ContentStatus } from '@domain/cms.interface';

export class CMSController {
    static createPage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const page = await CMSUseCases.createPage({ ...req.body, createdBy: req.user.userId });
        res.status(201).json({ status: 'success', data: { page } });
    });

    static getAllPages = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, type, status } = req.query;
        const result = await CMSUseCases.getAllPages(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 20,
            type as string,
            status as ContentStatus
        );
        res.json({ status: 'success', data: result });
    });

    static getPageById = asyncHandler(async (req: Request, res: Response) => {
        const page = await CMSUseCases.getPageById(req.params.id);
        res.json({ status: 'success', data: { page } });
    });

    static getPageBySlug = asyncHandler(async (req: Request, res: Response) => {
        const page = await CMSUseCases.getPageBySlug(req.params.slug);
        res.json({ status: 'success', data: { page } });
    });

    static updatePage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const page = await CMSUseCases.updatePage(req.params.id, { ...req.body, updatedBy: req.user.userId });
        res.json({ status: 'success', data: { page } });
    });

    static deletePage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        await CMSUseCases.deletePage(req.params.id, req.user.userId);
        res.json({ status: 'success', message: 'Page deleted' });
    });

    static publishPage = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401).json({ status: 'error', message: 'Authentication required' });
            return;
        }
        const page = await CMSUseCases.publishPage(req.params.id, req.user.userId);
        res.json({ status: 'success', data: { page } });
    });

    static getPublishedPages = asyncHandler(async (req: Request, res: Response) => {
        const pages = await CMSUseCases.getPublishedPages();
        res.json({ status: 'success', data: { pages } });
    });
}
