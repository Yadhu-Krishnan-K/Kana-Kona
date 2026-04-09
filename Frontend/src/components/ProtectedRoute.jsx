import { useAuthStore } from "../store/useAuthStore";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if(isCheckingAuth){
    return (<div className='flex items-center justify-center h-screen'>
      <span className="loading loading-infinity loading-lg"></span>
    </div>)
  }
  return authUser? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute