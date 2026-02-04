import { RouteObject } from "react-router-dom";
import Profile from "@/features/profile/Profile";
import RequiredAuth from "@/routes/RequiredAuth";
import Home from "@/features/home/Home";
import {Roles} from "@/features/role/Roles";
import { Users } from "@/features/user/Users";

import "@/styles/table.css";
import Layout from "@/layouts/Layout";
import ChangePassword from "@/features/auth/ChangePassword";

const PrivateRoute: RouteObject = {
  element: <RequiredAuth />,
  children: [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile", element: <Profile /> },
        { path: "/roles", element: <Roles /> },
        { path: "/users", element: <Users /> },
        { path: "/settings/change-password", element: <ChangePassword /> },
      ],
    },
  ],
};

export default PrivateRoute;
