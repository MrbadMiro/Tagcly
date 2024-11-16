import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import favoritesReducer from "../features/favorites/favoriteSlice"; // Update this import path
import cartSliceReducer from "../../redux/features/cart/cartSlice";
import shopReducer from "../features/shop/shopSlice";

// Create the store
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
     // Add the favorites reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// Define RootState type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Setup listeners for refetching queries automatically
setupListeners(store.dispatch);

export default store;