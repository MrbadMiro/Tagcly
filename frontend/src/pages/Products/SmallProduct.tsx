import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
// import HeartIcon from "./HeartIcon";

// Define the type for the product prop
interface ProductType {
  _id: string;
  name: string;
  price: number;
  image: string; // Change this to image
}

interface SmallProductProps {
  product: ProductType;
}

const SmallProduct: React.FC<SmallProductProps> = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative ">
        <img
          src={product.image} // Use image here
          alt={product.name}
          className=" rounded object-cover w-full h-[375px]"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-black">
            <div>{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
