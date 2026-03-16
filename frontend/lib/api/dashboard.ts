import { apiClient } from './client';

export interface DashboardStats {
    totalRFQs: number;
    rfqsThisMonth: number;
    totalLeads: number;
    leadsThisMonth: number;
    activeJobs: number;
    activeProducts: number;
    recentRFQs: Array<{
        id: string;
        rfqNumber: string;
        contactName: string;
        contactEmail: string;
        company: string;
        status: string;
        createdAt: string;
    }>;
}

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const res = await apiClient.get<{ status: string; data: DashboardStats }>('/dashboard/stats');
        return res.data.data;
    },
};
