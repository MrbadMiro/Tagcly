import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../src/redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../src/redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "./redux/features/shop/shopSlice";
import Loader from "../src/components/Loder";
import ProductCard from "./pages/Products/ProductCard";

// Define types for state and props
interface RootState {
	shop: {
		categories: Category[];
		products: Product[];
		checked: string[];
		radio: string[];
	};
}

interface Product {
	_id: string;
	price: number;
	brand?: string;
	// Add other relevant fields if necessary
}

interface Category {
	_id: string;
	name: string;
}

const Shop = () => {
	const dispatch = useDispatch();
	const { categories, products, checked, radio } = useSelector((state: RootState) => state.shop);

	const categoriesQuery = useFetchCategoriesQuery(undefined); // Pass undefined if no args are needed
	const [priceFilter, setPriceFilter] = useState("");

	const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

	useEffect(() => {
		if (!categoriesQuery.isLoading && categoriesQuery.data) {
			dispatch(setCategories(categoriesQuery.data));
		}
	}, [categoriesQuery.data, dispatch]);

	useEffect(() => {
		if ((!checked.length || !radio.length) && !filteredProductsQuery.isLoading) {
			const filteredProducts = filteredProductsQuery.data?.filter((product: Product) =>
				product.price.toString().includes(priceFilter) ||
				product.price === parseInt(priceFilter, 10)
			) || [];

			dispatch(setProducts(filteredProducts));
		}
	}, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

	const handleBrandClick = (brand: string) => {
		const productsByBrand = filteredProductsQuery.data?.filter(
			(product: Product) => product.brand === brand
		);
		dispatch(setProducts(productsByBrand || []));
	};

	const handleCheck = (value: boolean, id: string) => {
		const updatedChecked = value
			? [...checked, id]
			: checked.filter((c) => c !== id);
		dispatch(setChecked(updatedChecked));
	};

	const uniqueBrands = [
		...new Set(filteredProductsQuery.data?.map((product: Product) => product.brand).filter(Boolean)),
	];

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPriceFilter(e.target.value);
	};

	return (
		<>
			<div className="container mx-auto">
				<div className="flex md:flex-row">
					<div className="bg-[#151515] p-3 mt-2 mb-2">
						<h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Categories</h2>
						<div className="p-5 w-[15rem]">
							{categories?.map((c: Category) => (
								<div key={c._id} className="mb-2">
									<div className="flex items-center mr-4">
										<input
											type="checkbox"
											onChange={(e) => handleCheck(e.target.checked, c._id)}
											className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded"
										/>
										<label className="ml-2 text-sm font-medium text-white">{c.name}</label>
									</div>
								</div>
							))}
						</div>
						<h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Brands</h2>
						<div className="p-5">
							{uniqueBrands?.map((brand) => (
								<div key={brand} className="flex items-center mr-4 mb-5">
									<input
										type="radio"
										name="brand"
										onChange={() => handleBrandClick(brand)}
										className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300"
									/>
									<label className="ml-2 text-sm font-medium text-white">{brand}</label>
								</div>
							))}
						</div>
						<h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Price</h2>
						<div className="p-5 w-[15rem]">
							<input
								type="text"
								placeholder="Enter Price"
								value={priceFilter}
								onChange={handlePriceChange}
								className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg"
							/>
						</div>
						<div className="p-5 pt-0">
							<button className="w-full border my-4" onClick={() => window.location.reload()}>Reset</button>
						</div>
					</div>
					<div className="p-3">
						<h2 className="h4 text-center mb-2">{products?.length} Products</h2>
						<div className="flex flex-wrap">
							{products.length === 0 ? (
								<Loader />
							) : (
								products?.map((p: Product) => (
									<div className="p-3" key={p._id}>
										<ProductCard p={p} />
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Shop;
