import { RouteObject } from "react-router-dom";
import Login from "../pages/auth/login/login";
import RequestResetPassword from "../pages/auth/password/requestResetPassword";
import ResetPassword from "../pages/auth/password/resetPassword";
import RequireGuest from "@/src/components/requireGuest";

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
