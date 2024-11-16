import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loder";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Products";

interface ProductType {
  _id: string;
  name: string;
  price: number;
  image: string;  
  description?: string;
  brand?: string;
  category?: string;
  countInStock?: number;
  rating?: number;
  numReviews?: number;
}

interface ProductsApiResponse {
  products: ProductType[];
}

interface RouteParams {
  keyword?: string; // make keyword optional
  [key: string]: string | undefined; // index signature to satisfy the constraint
}

const Home: React.FC = () => {
  const { keyword } = useParams<RouteParams>();
  
  // Fetch products using the keyword from the route parameters
  const { data, isLoading, error } = useGetProductsQuery({ keyword }) as {
    data?: ProductsApiResponse;
    isLoading: boolean;
    error: any; 
  };

  console.log("Keyword:", keyword);
  console.log("API Data:", data);
  console.log("API Error:", error);

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem] text-black">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>
          <div>
            <div className="flex justify-center flex-wrap mt-[2rem] ">
              {data?.products && data.products.length > 0 ? (
                data.products.map((product: ProductType) => (
                  <div key={product._id}>
                    <Product product={product} />
                  </div>
                ))
              ) : (
                <p>No products available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
