import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetchJson<T>(endpoint: string): Promise<T | null> {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/rfq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ];

    // Dynamic: Products
    const productsData = await fetchJson<{ data: { products: Array<{ slug: string; updatedAt: string }> } }>('/products?status=ACTIVE&limit=500'); // ACTIVE is correct for ProductStatus
    const productRoutes: MetadataRoute.Sitemap = (productsData?.data?.products || []).map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Dynamic: Projects
    const projectsData = await fetchJson<{ data: { projects: Array<{ slug: string; updatedAt?: string; completionDate?: string }> } }>('/projects?limit=500');
    const projectRoutes: MetadataRoute.Sitemap = (projectsData?.data?.projects || []).map((p) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.completionDate || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Dynamic: CMS Pages (published only)
    const cmsData = await fetchJson<{ data: { pages: Array<{ slug: string; updatedAt: string }> } }>('/cms?status=PUBLISHED&limit=500');
    const cmsRoutes: MetadataRoute.Sitemap = (cmsData?.data?.pages || []).map((p) => ({
        url: `${BASE_URL}/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // Dynamic: Job Listings
    const jobsData = await fetchJson<{ data: { jobs: Array<{ id: string; updatedAt: string }> } }>('/careers/jobs?status=PUBLISHED&limit=200');
    const jobRoutes: MetadataRoute.Sitemap = (jobsData?.data?.jobs || []).map((j) => ({
        url: `${BASE_URL}/careers/${j.id}`,
        lastModified: new Date(j.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...projectRoutes, ...cmsRoutes, ...jobRoutes];
}
