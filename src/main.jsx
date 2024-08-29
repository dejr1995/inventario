import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./route/MyRoutes.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import NavBar from "./components/NavBar.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <MyRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
