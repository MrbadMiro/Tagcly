// apiSlice.ts
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constants";

// Define tag types
export type TagTypes = 'Product' | 'Order' | 'User' | 'Category';

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Category'] as const,
  endpoints: () => ({}),
});

// Export type helpers
export type ApiSlice = typeof apiSlice;
export type EndpointBuilder = ApiSlice['endpoints'];