import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login/login";
import Profile from "./pages/profile/profile"
import RequestResetPassword from "./pages/auth/password/requestResetPassword";
import ResetPassword from "./pages/auth/password/resetPassword";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/forgot-password" element={<RequestResetPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
