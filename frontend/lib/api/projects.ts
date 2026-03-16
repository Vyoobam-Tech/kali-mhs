import { apiClient } from './client';
import { Project, ProjectFilters } from '@/lib/types/project';

interface ProjectListResponse {
    status: string;
    results: number;
    total: number;
    data: {
        projects: Project[];
    };
}

interface ProjectResponse {
    status: string;
    data: {
        project: Project;
    };
}

export const projectApi = {
    getAll: async (filters: ProjectFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<ProjectListResponse>('/projects', { params });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<ProjectResponse>(`/projects/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await apiClient.get<ProjectResponse>(`/projects/slug/${slug}`);
        return response.data;
    },

    create: async (data: Partial<Project>) => {
        const response = await apiClient.post<ProjectResponse>('/projects', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Project>) => {
        const response = await apiClient.patch<ProjectResponse>(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/projects/${id}`);
    },
};
