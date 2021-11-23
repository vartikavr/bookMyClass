import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Header = () => {
  const [url, setURL] = useState("");
  useEffect(() => {
    getURLPathname();
  }, [window.location.pathname]);

  const getURLPathname = () => {
    setURL(window.location.pathname);
    //console.log(url);
  };

  const handleLogout = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get("/logout", {}, axiosConfig)
      .then((res) => {
        localStorage.removeItem("isLoggedIn");
        console.log("log out");
        if (url == "/") {
          window.location.reload();
        } else {
          toast.info("Logged out");
          history.push("/");
        }
      })
      .catch((e) => {
        console.log("error in client ...", e);
      });
  };
  const history = useHistory();

  return (
    <div className="Header">
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg-header">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            BookMyClass
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a
                className={`nav-item ${url == "/" ? " active" : ""}`}
                aria-current="page"
                href="/"
              >
                Home
              </a>
            </div>
            <div className="navbar-nav ms-auto">
              {!localStorage.getItem("isLoggedIn") && (
                <a
                  className={`nav-item d-block ${
                    url == "/login" ? " active" : ""
                  }`}
                  href="/login"
                >
                  SignUp/SignIn
                </a>
              )}
              {localStorage.getItem("isLoggedIn") && (
                <a
                  className={`nav-item ${
                    url == "/classrooms" ? " active" : ""
                  }`}
                  href="/classrooms"
                >
                  My Classrooms
                </a>
              )}
              {localStorage.getItem("isLoggedIn") && (
                <a
                  className={`nav-item ${url == "/class" ? " active" : ""}`}
                  href="/class"
                >
                  My Bookings
                </a>
              )}
              {localStorage.getItem("isLoggedIn") && (
                <a
                  className={`nav-item ${url == "/logout" ? " active" : ""}`}
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
