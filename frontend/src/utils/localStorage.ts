// Define a Product interface to ensure type safety
export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  // Add any other properties your product might have
}

// Add a product to localStorage
export const addFavoriteToLocalStorage = (product: Product): void => {
  const favorites = getFavoritesFromLocalStorage();
  
  // Check if the product is not already in favorites
  if (!favorites.some((p: Product) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Remove product from localStorage
export const removeFavoriteFromLocalStorage = (productId: string): void => {
  const favorites = getFavoritesFromLocalStorage();
  
  // Filter out the product with the matching ID
  const updatedFavorites = favorites.filter(
    (product: Product) => product._id !== productId
  );

  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = (): Product[] => {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};