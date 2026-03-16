import { apiClient } from './client';
import { CMSPage, CMSFilters } from '@/lib/types/cms';

interface CMSListResponse {
    status: string;
    results: number;
    total: number;
    data: {
        pages: CMSPage[];
    };
}

interface CMSResponse {
    status: string;
    data: {
        page: CMSPage;
    };
}

export const cmsApi = {
    getAll: async (filters: CMSFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<CMSListResponse>('/cms', { params });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<CMSResponse>(`/cms/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await apiClient.get<CMSResponse>(`/cms/slug/${slug}`);
        return response.data;
    },

    create: async (data: Partial<CMSPage>) => {
        const response = await apiClient.post<CMSResponse>('/cms', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CMSPage>) => {
        const response = await apiClient.patch<CMSResponse>(`/cms/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/cms/${id}`);
    },
};
