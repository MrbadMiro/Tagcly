import React, { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/features/store"; // Adjust import path
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localStorage";

// Define Product interface (ensure this matches your Product type)
interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  // Add other product properties as needed
}

// Define props type
interface HeartIconProps {
  product: Product;
}

const HeartIcon: React.FC<HeartIconProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites) || [];
  
  // Type-safe favorite check
  const isFavorite = favorites.some((p: Product) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-black" />
      )}
    </div>
  );
};

export default HeartIcon;