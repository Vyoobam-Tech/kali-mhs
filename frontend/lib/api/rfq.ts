import { apiClient } from './client';
import { RFQ, CreateRFQPayload, RFQFilters } from '@/lib/types/rfq';

interface RFQListResponse {
    status: string;
    results: number;
    total: number;
    data: {
        rfqs: RFQ[];
    };
}

interface RFQResponse {
    status: string;
    data: {
        rfq: RFQ;
    };
}

export const rfqApi = {
    getAll: async (filters: RFQFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<RFQListResponse>('/rfq', { params });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<RFQResponse>(`/rfq/${id}`);
        return response.data;
    },

    /**
     * Create an RFQ. Accepts either a plain object or FormData (for file uploads).
     * When files are attached the wizard sends FormData; otherwise JSON.
     */
    create: async (data: CreateRFQPayload | FormData) => {
        const isFormData = data instanceof FormData;
        const response = await apiClient.post<RFQResponse>('/rfq', data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        });
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await apiClient.patch<RFQResponse>(`/rfq/${id}/status`, { status });
        return response.data;
    },

    /**
     * Export RFQ as structured JSON for AI or external tools (admin only)
     */
    export: async (id: string) => {
        const response = await apiClient.get(`/rfq/${id}/export`);
        return response.data;
    },
};
