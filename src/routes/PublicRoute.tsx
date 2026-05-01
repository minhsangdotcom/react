import { RouteObject } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ForgotPassword } from "@/features/auth/forgotPassword/page/ForgotPassword";
import RequireGuest from "./RequireGuest";
import Login from "@/features/auth/login/page/Login";
import { ResetPassword } from "@/features/auth/forgotPassword/page/ResetPassword";

const PublicRoute: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: (
          <RequireGuest>
            <Login />
          </RequireGuest>
        ),
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
];
export default PublicRoute;
