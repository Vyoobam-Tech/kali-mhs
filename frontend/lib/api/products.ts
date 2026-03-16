import { apiClient } from './client';
import { Product, ProductFilters } from '@/lib/types/product';

interface ProductListResponse {
    status: string;
    results: number;
    total: number;
    data: {
        products: Product[];
    };
}

interface ProductResponse {
    status: string;
    data: {
        product: Product;
    };
}

export const productApi = {
    getAll: async (filters: ProductFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<ProductListResponse>('/products', { params });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<ProductResponse>(`/products/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await apiClient.get<ProductResponse>(`/products/slug/${slug}`);
        return response.data;
    },

    create: async (data: Partial<Product>) => { // Using Partial for now, better to have strict CreateDTO
        const response = await apiClient.post<ProductResponse>('/products', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Product>) => {
        const response = await apiClient.patch<ProductResponse>(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/products/${id}`);
    },
};
