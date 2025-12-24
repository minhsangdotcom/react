import AppRouter from "./routes/router";
import { NuqsAdapter } from "nuqs/adapters/react";
import "@/src/styles/globals.css";

const App = () => {
  return (
    <div className="app bg-100">
      <NuqsAdapter>
        <AppRouter />
      </NuqsAdapter>
    </div>
  );
};

export default App;
