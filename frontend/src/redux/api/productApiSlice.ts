import { PRODUCT_URL, UPLOAD_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

// Interface definitions
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductQueryParams {
  keyword?: string;
}

interface FilterOptions {
  checked: string[];
  radio: string[];
}

interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

interface UpdateProductData {
  productId: string;
  formData: FormData;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductQueryParams>({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Product" as const },
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
            ]
          : [{ type: "Product" as const }],
    }),

    getProductById: builder.query<Product, string>({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (_result, _error, productId) => [
        { type: "Product" as const, id: productId },
      ],
    }),

    allProducts: builder.query<Product[], void>({
      query: () => `${PRODUCT_URL}/allProducts`,
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Product" as const },
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
            ]
          : [{ type: "Product" as const }],
    }),

    getProductDetails: builder.query<Product, string>({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (_result, _error, productId) => [
        { type: "Product" as const, id: productId },
      ],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: [{ type: "Product" }],
    }),

    updateProduct: builder.mutation<Product, UpdateProductData>({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    uploadProductImage: builder.mutation<{ image: string }, FormData>({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    createReview: builder.mutation<{ message: string }, CreateReviewData>({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    getTopProducts: builder.query<Product[], void>({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Product" as const },
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
            ]
          : [{ type: "Product" as const }],
    }),

    getNewProducts: builder.query<Product[], void>({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Product" as const },
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
            ]
          : [{ type: "Product" as const }],
    }),

    getFilteredProducts: builder.query<Product[], FilterOptions>({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Product" as const },
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
            ]
          : [{ type: "Product" as const }],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
