import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/features/store.ts";
import PrivateRoute from "./components/PrivateRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Authentication pages
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";

// Other main application pages
import Profile from "./pages/User/Profile";
import AdminRoute from "./pages/Admin/AdminRoute";
import UserList from "./pages/Admin/UserList.tsx";
import CategoryList from "./pages/Admin/CategoryList";
import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";
import Home from "./pages/Home.tsx";
import Favorites from "./pages/Products/Favorites";
import ProductDetails from "./pages/Products/ProductDetails.tsx";
import Cart from "./pages/Cart.tsx";
import Shop from "./Shop.tsx";
import Shipping from "./pages/Orders/Shipping.tsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.tsx";
import Order from "./pages/Orders/Order.tsx";
import UserOrder from "./pages/User/UserOrder.tsx";
import OrderList from "./pages/Admin/OrderList.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";

// PayPal configuration options
const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_CLIENT_ID_HERE",
  currency: "USD",
  intent: "capture",
};

// Set up the router with routes for different pages
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="shop" element={<Shop />} />
      <Route path="user-orders" element={<UserOrder />} />


      {/* Protected routes that require the user to be logged in */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
      </Route>

      {/* Admin-specific routes that require admin privileges */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
      </Route>
    </Route>
  )
);

// Render the application
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PayPalScriptProvider options={paypalOptions}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);