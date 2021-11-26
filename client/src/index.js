import React from "react";
import ReactDOM from "react-dom";
import "./app.css";
import App from "./App";
import "../public/vendor/bootstrap/css/bootstrap.min.css";
import "../public/vendor/bootstrap-icons/bootstrap-icons.css";
import "../public/vendor/boxicons/css/boxicons.min.css";
import "../public/vendor/glightbox/css/glightbox.min.css";
import "../public/vendor/swiper/swiper-bundle.min.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
