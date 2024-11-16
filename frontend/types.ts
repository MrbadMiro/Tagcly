// types.ts
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    brand: string;
    countInStock: number;
    image: string;
    createdAt: string;
    updatedAt: string;
    reviews?: Review[];
    rating?: number;
    numReviews?: number;
  }
  
  export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Review {
    _id: string;
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: PaymentResult;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
  }
  
  export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
  export interface PaymentResult {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  }
  
  export interface ApiError {
    status: number;
    data: {
      message: string;
      stack?: string;
    };
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
  }
  
  export interface ProductQueryParams {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
  }
  
  export interface FilteredProductsRequest {
    checked: string[];
    radio: number[];
  }
  
  export interface ReviewData {
    productId: string;
    rating: number;
    comment: string;
  }
  
  export interface ProductResponse {
    name: string;
    error?: string;
  }
  
  export interface UploadResponse {
    message: string;
    image: string;
  }