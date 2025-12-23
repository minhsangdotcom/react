import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/src/store/hook";
import { JSX } from "react";

const RequireGuest = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector((state) => state.auth);

  if (auth.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireGuest;
