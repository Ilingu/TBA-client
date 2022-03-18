import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// UI
import "./index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Toaster />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
