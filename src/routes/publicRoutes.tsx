import { RouteObject } from "react-router-dom";
import Login from "@features/auth/Login";
import RequestResetPassword from "@/features/auth/RequestResetPassword";
import ResetPassword from "@/features/auth/ResetPassword";
import RequireGuest from "@/routes/RequireGuest";

const PublicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <RequireGuest>
        <Login />
      </RequireGuest>
    ),
  },
  { path: "/forgot-password", element: <RequestResetPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
];

export default PublicRoutes;
