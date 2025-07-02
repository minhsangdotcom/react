import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import React from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
