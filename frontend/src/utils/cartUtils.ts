// Interfaces
interface CartItem {
    price: number;
    qty: number;
  }
  
  interface CartState {
    cartItems: CartItem[];
    itemsPrice: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
  }
  
  // Helper function to add decimals
  export const addDecimals = (num: number): string => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  
  // Main cart update function
  export const updateCart = (state: CartState): CartState => {
    // Calculate the items price
    state.itemsPrice = addDecimals(
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  
    // Calculate the shipping price
    state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 10);
  
    // Calculate the tax price
    state.taxPrice = addDecimals(Number((0.15 * Number(state.itemsPrice)).toFixed(2)));
  
    // Calculate the total price
    state.totalPrice = addDecimals(
      Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
    );
  
    // Save the cart to localStorage
    localStorage.setItem("cart", JSON.stringify(state));
  
    return state;
  };