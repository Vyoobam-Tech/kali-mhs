import { apiClient } from './client';
import { Job, JobFilters, JobApplication } from '@/lib/types/career';

interface JobListResponse {
    status: string;
    results: number;
    total: number;
    data: {
        jobs: Job[];
    };
}

interface JobResponse {
    status: string;
    data: {
        job: Job;
    };
}

interface ApplicationListResponse {
    status: string;
    data: {
        applications: JobApplication[];
        total: number;
        page: number;
        totalPages: number;
    };
}

interface ApplicationResponse {
    status: string;
    data: {
        application: JobApplication;
    };
}

export const careerApi = {
    // ── Public: Jobs ──────────────────────────────────────────────
    getAll: async (filters: JobFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.department) params.append('department', filters.department);
        if (filters.type) params.append('type', filters.type);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        const response = await apiClient.get<JobListResponse>('/careers', { params });
        return response.data;
    },

    getActive: async (limit = 20) => {
        const response = await apiClient.get<JobListResponse>('/careers/active', { params: { limit } });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<JobResponse>(`/careers/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await apiClient.get<JobResponse>(`/careers/slug/${slug}`);
        return response.data;
    },

    // ── Public: Applications ──────────────────────────────────────
    /**
     * Submit job application with resume file upload
     */
    submitApplication: async (formData: FormData) => {
        const response = await apiClient.post('/careers/applications', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // ── Admin: Jobs ───────────────────────────────────────────────
    create: async (data: Partial<Job>) => {
        const response = await apiClient.post<JobResponse>('/careers', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Job>) => {
        const response = await apiClient.put<JobResponse>(`/careers/${id}`, data);
        return response.data;
    },

    publish: async (id: string) => {
        const response = await apiClient.post<JobResponse>(`/careers/${id}/publish`, {});
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/careers/${id}`);
    },

    // ── Admin: Applications ───────────────────────────────────────
    getAllApplications: async (filters: { page?: number; limit?: number; jobId?: string; status?: string } = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.jobId) params.append('jobId', filters.jobId);
        if (filters.status) params.append('status', filters.status);
        const response = await apiClient.get<ApplicationListResponse>('/careers/applications/all', { params });
        return response.data;
    },

    getApplicationById: async (id: string) => {
        const response = await apiClient.get<ApplicationResponse>(`/careers/applications/${id}`);
        return response.data;
    },

    updateApplicationStatus: async (id: string, status: string, notes?: string) => {
        const response = await apiClient.put<ApplicationResponse>(`/careers/applications/${id}/status`, { status, notes });
        return response.data;
    },

    addApplicationNote: async (id: string, note: string) => {
        const response = await apiClient.post<ApplicationResponse>(`/careers/applications/${id}/notes`, { note });
        return response.data;
    },
};
