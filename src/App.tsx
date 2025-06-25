import { Provider } from "react-redux";
import AppRouter from "./routes/router";
import { store } from "./store/store";

const App = () => {
  return (
    <div className="app bg-100">
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </div>
  );
};

export default App;
