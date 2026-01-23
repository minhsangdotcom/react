import AppRouter from "@/routes/router";
import "@/styles/global.css";
import { Toaster } from "react-hot-toast";
import './i18';
const App = () => {
  return (
    <div className="app bg-100">
      <AppRouter />
      <Toaster />
    </div>
  );
};

export default App;
