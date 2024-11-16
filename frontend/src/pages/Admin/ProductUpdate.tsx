import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

// Define Category interface
interface Category {
  _id: string;
  name: string;
}

// Define Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  brand: string;
  countInStock: number;
  image: string;
}

// Define UploadImageResponse interface
interface UploadImageResponse {
  message: string;
  image: string;
}

const ProductUpdate: React.FC = () => {
  const params = useParams<{ _id?: string }>();
  const navigate = useNavigate();
  const productId = params._id;
  const productQuery = useGetProductByIdQuery(productId as string);
  const productData = productQuery.data as Product | undefined;
  const { data: categories = [] } = useFetchCategoriesQuery({});
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [stock, setStock] = useState<string>("");

  useEffect(() => {
    if (productData) {
      const product = productData;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategory(product.category?._id || "");
      setQuantity(product.quantity.toString());
      setBrand(product.brand);
      setImage(product.image);
      setStock(product.countInStock.toString());
    }
  }, [productData]);

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap() as UploadImageResponse;
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      const result = await updateProduct({
        productId: productId as string,
        formData,
      }).unwrap();
      if ("error" in result) {
        toast.error((result.error as any)?.message || "Update failed");
      } else {
        toast.success(`Product successfully updated`);
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;
      const result = await deleteProduct(productId as string).unwrap();
      if (result && "name" in result) {
        toast.success(`"${result.name}" is deleted`);
      } else {
        toast.error("Delete failed. Try again.");
      }
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 xl:px-32 sm:px-4">
      <div className="flex flex-col md:flex-row text-black space-y-4 md:space-y-0 md:space-x-4">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h1 className="text-2xl font-semibold mb-6">Update Product</h1>
          {image && (
            <div className="text-center mb-4">
              <img src={image} alt="product" className="block mx-auto max-h-64 object-contain" />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white bg-pink-500 text-center py-4 cursor-pointer rounded-lg">
                {image ? image.split("/").pop() : "Upload Image"}
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
                  className="w-full p-4 border rounded-lg custom-shadow outline-none text-black"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block mb-1">Category</label>
                <select
                  id="category"
                  className="w-full p-4 mb-3 border rounded-lg custom-shadow outline-none text-black"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat: Category) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={handleDelete}>
                  Delete Product
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Update Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
