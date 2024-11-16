import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loder"; // Fixed the import name
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

// Define types for the product structure
interface ProductType {
  _id: string;
  name: string;
  price: number;
  image: string; // Change this to image
}

const Header: React.FC = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="text-red-500 text-center">ERROR</h1>; // Styled error message
  }

  return (
    <div className="flex flex-cols-2 md:flex-row justify-between items-center px-4">
      {/* This div will take two columns on larger screens */}
      <div className="hidden md:block md:w-1/2 p-4"> {/* Show on medium screens and up */}
        <div className="grid grid-cols-2 gap-4"> {/* Added gap for spacing */}
          {data?.map((product: ProductType) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Carousel takes full width on small screens and half width on medium and up */}
      <div className="md:w-1/2 w-full p-4"> {/* Ensure full width on small screens */}
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;
