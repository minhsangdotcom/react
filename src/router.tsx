import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import Profile from "./pages/profile/profile"
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
