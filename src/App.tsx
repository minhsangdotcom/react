import AppRouter from "./routes/router";
import "@/src/styles/globals.css";

const App = () => {
  return (
    <div className="app bg-100">
      <AppRouter />
    </div>
  );
};

export default App;
