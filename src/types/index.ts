export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    inventory: number;
    imageUrl?: string; // Optional in case some products don't have images
    active: boolean;
}

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
}

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    id: string;
    orderItems: OrderItem[];
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}
