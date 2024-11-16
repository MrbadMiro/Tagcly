import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Define the shape of your auth state
interface AuthState {
  auth: {
    userInfo: {
      isAdmin: boolean;
      // Add any other properties of userInfo if needed
    } | null;
  };
}

const AdminRoute = () => {
  const { userInfo } = useSelector((state: AuthState) => state.auth);
  
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
