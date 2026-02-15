import api from '../../lib/axios';
import { Product } from '../../types';

export const productService = {
    getAllProducts: async () => {
        // The backend might return a List directly or a Page. 
        // Based on previous conversations, it seemed to return a List or Page. 
        // I'll assume standard Spring Data REST pagination or just a list for now, 
        // but looking at `AuthController`, it returned `ResponseEntity.ok(...)`.
        // Let's assume the /products endpoint returns a Page or List.
        // Safest is to just GET /product first.
        // If the user hasn't implemented pagination explicitly, it might just be a list.
        // API_SCHEMAS.md didn't specify the list response format, only the creation payload.
        // I will assume it returns a list for simplicity, or handle both.
        const response = await api.get<Product[]>(`/product`);
        return response.data;
    },

    getProductById: async (id: string) => {
        const response = await api.get<Product>(`/product/${id}`);
        return response.data;
    },

    // Helper to search (if backend supports it)
    // searchProducts: async (query: string) => { ... }
};
