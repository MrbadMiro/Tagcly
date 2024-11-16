import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  brand: string;
  countInStock: number;
  image?: string;
}

interface UploadImageResponse {
  message: string;
  image: string;
}

interface CreateProductResponse {
  error?: string;
  name?: string;
}

const ProductList: React.FC = () => {
  const [image, setImage] = useState<File | string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const productData: FormData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock.toString());

      const { data } = (await createProduct(productData as unknown as Partial<Product>)) as {
        data: CreateProductResponse;
      };

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap() as UploadImageResponse;
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error: any) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto px-4 xl:px-32 sm:px-4">
      <div className="flex flex-col md:flex-row text-black space-y-4 md:space-y-0 md:space-x-4">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h1 className="text-2xl font-semibold mb-6">Create Product</h1>

          {imageUrl && (
            <div className="text-center mb-4">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-64 object-contain"
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white bg-pink-500 text-center py-4 cursor-pointer rounded-lg">
                {image instanceof File ? image.name : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="md:flex md:space-x-4">
                <div className="w-full">
                  <label htmlFor="name" className="block mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="price" className="block mb-1">Price</label>
                  <input
                    type="number"
                    id="price"
                    className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:flex md:space-x-4">
                <div className="w-full">
                  <label htmlFor="quantity" className="block mb-1">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="brand" className="block mb-1">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full mb-4">
                <label htmlFor="description" className="block mb-1">Description</label>
                <textarea
                  id="description"
                  className="w-full p-4 mb-3  border rounded-lg custom-shadow outline-none text-black"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="md:flex md:space-x-4">
                <div className="w-full">
                  <label htmlFor="stock" className="block mb-1">Count In Stock</label>
                  <input
                    type="number"
                    id="stock"
                    className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="category" className="block mb-1">Category</label>
                  <select
                    id="category"
                    className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">Choose Category</option>
                    {categories?.map((c: Category) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-6 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
