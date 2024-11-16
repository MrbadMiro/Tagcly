import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/features/store"; // Import RootState type

const PrivateRoute = () => {
  // Get the userInfo from the Redux state
  const { userInfo } = useSelector((state: RootState) => state.auth); 
  
  // If userInfo exists, allow access to the Outlet (protected route); otherwise, redirect to login
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
