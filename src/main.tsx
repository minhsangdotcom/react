import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import React from "react";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { NuqsAdapter } from "nuqs/adapters/react";
import { injectStore } from "@/lib/http/interceptor";

injectStore(store);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <MantineProvider>
          <NuqsAdapter>
            <App />
          </NuqsAdapter>
      </MantineProvider>
    </React.StrictMode>
  </Provider>
);
