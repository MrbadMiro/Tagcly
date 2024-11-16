import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateCart } from "../../../utils/cartUtils";

// Interfaces
interface CartProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
  brand?: string;
  description?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartState {
  cartItems: CartProduct[];
  shippingAddress: Partial<ShippingAddress>;
  paymentMethod: string;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
}

interface CartItemPayload extends CartProduct {
  user?: string;
  rating?: number;
  numReviews?: number;
  reviews?: any[];
}

// Initial state with type
const initialState: CartState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "PayPal",
  itemsPrice: "0",
  shippingPrice: "0",
  taxPrice: "0",
  totalPrice: "0",
  ...(localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") || "")
    : {}),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemPayload>) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action: PayloadAction<Partial<ShippingAddress>>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: () => {
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;