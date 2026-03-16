import { apiClient } from './client';

export interface Document {
    id: string;
    title: string;
    description?: string;
    category: string;
    status: string;
    accessLevel: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    slug: string;
    viewCount: number;
    downloadCount: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface LeadCaptureData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
}

export interface DocumentAccessResponse {
    downloadUrl: string;
    expiresAt: string;
    leadId: string;
}

export const documentsApi = {
    // Get all published documents
    getPublished: async (): Promise<Document[]> => {
        const response = await apiClient.get('/documents/published');
        return response.data.data.documents;
    },

    // Get document by ID
    getById: async (id: string): Promise<Document> => {
        const response = await apiClient.get(`/documents/${id}`);
        return response.data.data.document;
    },

    // Request document access (lead capture)
    requestAccess: async (
        documentId: string,
        leadData: LeadCaptureData
    ): Promise<DocumentAccessResponse> => {
        const response = await apiClient.post(
            `/documents/${documentId}/request-access`,
            leadData
        );
        return response.data.data;
    },

    // Download with signed URL token
    downloadWithToken: async (token: string): Promise<{ fileUrl: string; fileName: string }> => {
        const response = await apiClient.get(`/documents/download/${token}`);
        return response.data.data;
    },

    // Admin: Get document analytics
    getAnalytics: async (documentId: string): Promise<any> => {
        const response = await apiClient.get(`/documents/${documentId}/analytics`);
        return response.data.data.analytics;
    },

    // Admin: Get all documents
    getAll: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        status?: string;
        search?: string;
    }): Promise<{ documents: Document[]; total: number; page: number; totalPages: number }> => {
        const response = await apiClient.get('/documents', { params });
        return response.data.data;
    },

    // Admin: Create document
    create: async (data: Partial<Document>): Promise<Document> => {
        const response = await apiClient.post('/documents', data);
        return response.data.data.document;
    },

    // Admin: Update document
    update: async (id: string, data: Partial<Document>): Promise<Document> => {
        const response = await apiClient.put(`/documents/${id}`, data);
        return response.data.data.document;
    },

    // Admin: Delete document
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/documents/${id}`);
    },

    // Admin: Publish document
    publish: async (id: string): Promise<Document> => {
        const response = await apiClient.post(`/documents/${id}/publish`);
        return response.data.data.document;
    },
};
