import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Adjust the import path to your root store

// Define the Product interface more comprehensively
export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  // Add any other properties your product might have
}

// Define the state type
type FavoritesState = Product[];

// Initial state
const initialState: FavoritesState = [];

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      // Check if the product is not already in favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<Product>) => {
      // Remove the product with the matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (_, action: PayloadAction<Product[]>) => {
      // Set the favorites from localStorage
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

// Selector
export const selectFavoriteProduct = (state: RootState) => state.favorites;

export default favoriteSlice.reducer;