import { useState, ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	useGetProductDetailsQuery,
	useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loder";
import Message from "../../components/Message";
import {
	FaBox,
	FaClock,
	FaShoppingCart,
	FaStar,
	FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { RootState } from "../../redux/features/store";
import { addToCart } from "../../redux/features/cart/cartSlice";

// Define types for product and review-related data
interface Product {
	_id: string;
	name: string;
	image: string;
	description: string;
	price: number;
	brand: string;
	rating: number;
	numReviews: number;
	countInStock: number;
	createdAt: string;
	quantity?: number;
}

interface UserInfo {
	name: string;
	email: string;
	token: string;
}

// Helper function to check if an error is a FetchBaseQueryError
const isFetchBaseQueryError = (
	error: any
): error is { data: { message: string } } =>
	"data" in error && typeof error.data === "object" && "message" in error.data;

const ProductDetails = () => {
	const { id: productId } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useDispatch(); // Define dispatch here

	if (!productId) {
		navigate("/");
		return null;
	}

	const [qty, setQty] = useState<number>(1);
	const [rating, setRating] = useState<number>(0);
	const [comment, setComment] = useState<string>("");

	const {
		data: product,
		isLoading,
		refetch,
		error,
	} = useGetProductDetailsQuery(productId);

	const { userInfo } = useSelector((state: RootState) => state.auth) as {
		userInfo: UserInfo;
	};

	const [createReview, { isLoading: loadingProductReview }] =
		useCreateReviewMutation();

	const submitHandler = async (e: FormEvent) => {
		e.preventDefault();

		try {
			await createReview({
				productId: productId!,
				rating,
				comment,
			}).unwrap();
			refetch();
			toast.success("Review created successfully");
		} catch (error: any) {
			const errorMessage = error?.data?.message || error.message;
			toast.error(errorMessage);
		}
	};

	const addToCartHandler = () => {
		if (product) {
			dispatch(addToCart({ ...product, qty }));
			navigate("/cart");
		}
	};

	return (
		<>
			<div>
				<Link
					to="/"
					className="text-black font-semibold hover:underline ml-[10rem]">
					Go Back
				</Link>
			</div>

			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="error">
					{isFetchBaseQueryError(error)
						? error.data.message
						: "An error occurred"}
				</Message>
			) : (
				<>
					<div className="flex w-full flex-col relative items-between mt-[2rem] md:px-24 px-6">
						<div className="flex flex-cols-2 w-full">
							<div className="w-full p-8">
								<img
									src={product?.image}
									alt={product?.name}
									className="w-full h-full object-cover"
								/>
								{product && <HeartIcon product={product} />}
							</div>

							<div className="flex flex-col justify-between">
								<h2 className="text-2xl font-semibold text-black">
									{product?.name}
								</h2>
								<p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
									{product?.description}
								</p>
								<p className="text-5xl my-4 font-extrabold text-black">
									$ {product?.price}
								</p>

								<div className="flex items-center justify-between w-[20rem]">
									<div className="one text-black">
										<h1 className="flex items-center mb-6">
											<FaStore className="mr-2 text-black" /> Brand:{" "}
											{product?.brand}
										</h1>
										<h1 className="flex items-center mb-6 w-[20rem]">
											<FaClock className="mr-2 text-black" /> Added:{" "}
											{moment(product?.createdAt).fromNow()}
										</h1>
										<h1 className="flex items-center mb-6">
											<FaStar className="mr-2 text-black" /> Reviews:{" "}
											{product?.numReviews}
										</h1>
									</div>

									<div className="two">
										<h1 className="flex items-center mb-6">
											<FaStar className="mr-2 text-black" /> Ratings:{" "}
											{product?.rating}
										</h1>
										<h1 className="flex items-center mb-6">
											<FaShoppingCart className="mr-2 text-black" /> Quantity:{" "}
											{product?.quantity ?? "N/A"}
										</h1>
										<h1 className="flex items-center mb-6 w-[10rem]">
											<FaBox className="mr-2 text-black" /> In Stock:{" "}
											{product?.countInStock}
										</h1>
									</div>
								</div>

								<div className="flex justify-between text-black flex-wrap">
									<Ratings
										value={product?.rating || 0}
										text={`${product?.numReviews || 0} reviews`}
									/>

									{product?.countInStock && product.countInStock > 0 && (
										<div>
											<select
												value={qty}
												onChange={(e: ChangeEvent<HTMLSelectElement>) =>
													setQty(Number(e.target.value))
												}
												className="p-2 w-[6rem] rounded-lg text-black">
												{[...Array(product.countInStock).keys()].map((x) => (
													<option key={x + 1} value={x + 1}>
														{x + 1}
													</option>
												))}
											</select>
										</div>
									)}
								</div>

								<div className="btn-container">
									<button
										className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
										onClick={addToCartHandler}
										disabled={product?.countInStock === 0}>
										Add To Cart
									</button>
								</div>
							</div>
						</div>

						<div className="mt-[5rem] container flex flex-col items-start justify-between ml-[10rem]">
							{product && (
								<ProductTabs
									loadingProductReview={loadingProductReview}
									userInfo={!!userInfo}
									submitHandler={submitHandler}
									rating={rating}
									setRating={setRating}
									comment={comment}
									setComment={setComment}
									product={product}
								/>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default ProductDetails;
