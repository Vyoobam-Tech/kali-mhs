import { apiClient } from './client';
import { Lead, LeadFilters, LeadActivity, ActivityType } from '@/lib/types/lead';

interface LeadListResponse {
    status: string;
    results: number;
    total: number;
    data: {
        leads: Lead[];
    };
}

interface LeadResponse {
    status: string;
    data: {
        lead: Lead;
    };
}

export const leadApi = {
    getAll: async (filters: LeadFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.source) params.append('source', filters.source);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<LeadListResponse>('/leads', { params });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<LeadResponse>(`/leads/${id}`);
        return response.data;
    },

    create: async (data: Partial<Lead>) => {
        const response = await apiClient.post<LeadResponse>('/leads', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Lead>) => {
        const response = await apiClient.patch<LeadResponse>(`/leads/${id}`, data);
        return response.data;
    },

    addActivity: async (id: string, activity: { type: ActivityType, subject: string, description?: string }) => {
        // Assuming backend has /leads/:id/activity endpoint or similar
        // Let's check backend routes if possible, or build robustly.
        // Usually patch to /leads/:id fits or specific sub-resource.
        // For now I'll assume Update Lead logic handles activity array push or dedicated endpoint.
        // Let's use a specific endpoint assumption: POST /leads/:id/activities
        const response = await apiClient.post<LeadResponse>(`/leads/${id}/activities`, activity);
        return response.data;
    },
};
