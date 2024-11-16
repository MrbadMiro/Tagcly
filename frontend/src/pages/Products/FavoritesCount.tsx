import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/features/store"; // Adjust import path
import { Product } from "../../redux/features/favorites/favoriteSlice"; // Adjust import path

const FavoritesCount: React.FC = () => {
  // Type-safe selector with explicit RootState and Product type
  const favorites = useSelector((state: RootState) => state.favorites as Product[]);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-2 top-8">
      {favoriteCount > 0 && (
        <span 
          className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full"
          data-testid="favorites-count"
          aria-label={`${favoriteCount} items in favorites`}
        >
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;