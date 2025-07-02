import { Provider } from "react-redux";
import AppRouter from "./routes/router";
import { store } from "./store/store";
import { NuqsAdapter } from "nuqs/adapters/react";
import '@/src/styles/globals.css'

const App = () => {
  return (
    <div className="app bg-100">
      <Provider store={store}>
        <NuqsAdapter>
          <AppRouter />
        </NuqsAdapter>
      </Provider>
    </div>
  );
};

export default App;
