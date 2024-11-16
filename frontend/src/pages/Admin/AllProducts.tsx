import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

// Define the interface for a product object
interface Product {
  _id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  createdAt: string;
}

const AllProducts = () => {
  // Type the query result with product array
  const { data: products = [], isLoading, isError } = useAllProductsQuery();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 md:px-[4rem] lg:px-[6rem] xl:px-[9rem]">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/4 p-3 text-black">
            <div className="text-xl font-bold h-12">
              All Products ({products.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-6 mt-4">
              {products.map((product: Product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block mb-4 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[200px] object-cover z-10"
                    />
                    <div className="p-4 flex flex-col justify-around">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold">
                          {product?.name}
                        </h5>
                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-500 text-sm mb-4">
                        {product?.description?.substring(0, 120)}...
                      </p>

                      <div className="flex justify-between items-center">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                        >
                          Update Product
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p className="font-bold text-lg">$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="md:w-1/4 p-3 mt-8 md:mt-0">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
