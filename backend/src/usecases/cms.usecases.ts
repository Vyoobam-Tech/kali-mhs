import { CMSPageModel, ICMSPageDocument } from '@infrastructure/database/models/CMS.model';
import { ICreateCMSPage, IUpdateCMSPage, ICMSPage, ContentStatus } from '@domain/cms.interface';
import { AppError } from '@middlewares/errorHandler';

export class CMSUseCases {
    static async createPage(pageData: ICreateCMSPage): Promise<ICMSPage> {
        const slug = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await CMSPageModel.findBySlug(slug);
        if (existing) throw new AppError(409, 'Page with this title exists');

        const page = new CMSPageModel({ ...pageData, slug, status: ContentStatus.DRAFT, isDeleted: false });
        await page.save();
        return page.toJSON() as ICMSPage;
    }

    static async getAllPages(page: number = 1, limit: number = 20, type?: string, status?: ContentStatus) {
        const skip = (page - 1) * limit;
        const filter: any = { isDeleted: false };
        if (type) filter.type = type;
        if (status) filter.status = status;

        const [pages, total] = await Promise.all([
            CMSPageModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            CMSPageModel.countDocuments(filter),
        ]);

        return { pages: pages.map((p) => p.toJSON() as ICMSPage), total, page, totalPages: Math.ceil(total / limit) };
    }

    static async getPageById(pageId: string): Promise<ICMSPage> {
        const page = await CMSPageModel.findOne({ _id: pageId, isDeleted: false });
        if (!page) throw new AppError(404, 'Page not found');
        return page.toJSON() as ICMSPage;
    }

    static async getPageBySlug(slug: string): Promise<ICMSPage> {
        const page = await CMSPageModel.findBySlug(slug);
        if (!page) throw new AppError(404, 'Page not found');
        return page.toJSON() as ICMSPage;
    }

    // Fields that are safe for a client PUT request to update.
    // System fields (createdBy, isDeleted, publishedAt, publishedBy, updatedBy)
    // are intentionally excluded to prevent privilege escalation.
    private static readonly UPDATABLE_FIELDS: (keyof IUpdateCMSPage)[] = [
        'title', 'slug', 'type', 'status', 'content', 'excerpt',
        'featuredImage', 'category', 'tags', 'metaTitle', 'metaDescription',
        'scheduledAt',
    ];

    static async updatePage(pageId: string, updateData: IUpdateCMSPage): Promise<ICMSPage> {
        const page = await CMSPageModel.findOne({ _id: pageId, isDeleted: false });
        if (!page) throw new AppError(404, 'Page not found');

        // Only apply whitelisted fields — prevents overwriting audit/system fields
        for (const field of CMSUseCases.UPDATABLE_FIELDS) {
            if (field in updateData && updateData[field] !== undefined) {
                (page as any)[field] = updateData[field];
            }
        }

        await page.save();
        return page.toJSON() as ICMSPage;
    }

    static async deletePage(pageId: string, deletedBy: string): Promise<void> {
        const page = await CMSPageModel.findOne({ _id: pageId, isDeleted: false });
        if (!page) throw new AppError(404, 'Page not found');
        page.isDeleted = true;
        page.updatedBy = deletedBy as any;
        await page.save();
    }

    static async publishPage(pageId: string, publishedBy: string): Promise<ICMSPage> {
        const page = await CMSPageModel.findOne({ _id: pageId, isDeleted: false });
        if (!page) throw new AppError(404, 'Page not found');
        page.status = ContentStatus.PUBLISHED;
        page.publishedAt = new Date();
        page.publishedBy = publishedBy as any;
        await page.save();
        return page.toJSON() as ICMSPage;
    }

    static async getPublishedPages(): Promise<ICMSPage[]> {
        const pages = await CMSPageModel.findPublished();
        return pages.map((p) => p.toJSON() as ICMSPage);
    }
}
