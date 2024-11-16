import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/features/store"; // Adjust import path
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Products"; // Adjust import path

// Define ProductType interface to match Product
export interface ProductType {
  _id: string;
  name: string;
  price: number;
  image?: string; // Make image optional to match Product interface
}

const Favorites: React.FC = () => {
  // Type-safe selector using RootState, asserting as ProductType[]
  const favorites = useSelector((state: RootState) => selectFavoriteProduct(state)) as ProductType[];

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem] text-black">
        FAVORITE PRODUCTS
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No favorite products yet
        </div>
      ) : (
        <div className="flex flex-wrap text-black">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
