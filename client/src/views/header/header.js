import "./header.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Header = () => {
  //get current url
  const [url, setURL] = useState("");
  useEffect(() => {
    getURLPathname();
    // eslint-disable-next-line
  }, [window.location.pathname]);

  //get the current pathname from the url
  const getURLPathname = () => {
    setURL(window.location.pathname);
  };

  //handle logout in the backend
  const handleLogout = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get("/api/logout", {}, axiosConfig)
      .then((res) => {
        if (url === "/") {
          window.location.reload();
        } else {
          toast.info("Logged out");
          history.push("/");
        }
      })
      .catch((e) => {
        toast.error("Error in logging out!");
      });
  };
  const history = useHistory();

  return (
    <div className="Header">
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg-header">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            BookMyClass
          </Link>
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
              <Link
                className={`nav-item ${url === "/" ? " active" : ""}`}
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </div>
            <div className="navbar-nav ms-auto">
              {/* check if user is logged in or not(cookie is set or not) */}
              {!document.cookie && (
                <Link
                  className={`nav-item d-block ${
                    url === "/login" ? " active" : ""
                  }`}
                  to="/login"
                >
                  SignUp/SignIn
                </Link>
              )}
              {/* check if user is logged in or not(cookie is set or not) */}
              {document.cookie && (
                <Link
                  className={`nav-item ${
                    url === "/classrooms" ? " active" : ""
                  }`}
                  to="/classrooms"
                >
                  My Classrooms
                </Link>
              )}
              {/* check if user is logged in or not(cookie is set or not) */}
              {document.cookie && (
                <Link
                  className={`nav-item ${url === "/class" ? " active" : ""}`}
                  to="/class"
                >
                  My Bookings
                </Link>
              )}
              {/* check if user is logged in or not (cookie is set or not) */}
              {document.cookie && (
                <Link
                  className={`nav-item ${url === "/profile" ? " active" : ""}`}
                  to="/profile"
                >
                  My Profile
                </Link>
              )}
              {/* check if user is logged in or not(cookie is set or not) */}
              {document.cookie && (
                <Link
                  className={`nav-item ${url === "/logout" ? " active" : ""}`}
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
