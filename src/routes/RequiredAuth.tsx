import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hook";

const PrivateRoute: React.FC = () => {
  const { token } = useAppSelector((store) => store.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
