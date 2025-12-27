import { RouteObject } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import RequestResetPassword from "../pages/auth/password/RequestResetPassword";
import ResetPassword from "../pages/auth/password/ResetPassword";
import RequireGuest from "@/src/components/RequireGuest";

const publicRoutes: RouteObject[] = [
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

export default publicRoutes;
