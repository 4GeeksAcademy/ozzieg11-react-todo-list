import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// index.css'
import "../styles/index.css";

// components
import TodoList from "./components/TodoList";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>
);
