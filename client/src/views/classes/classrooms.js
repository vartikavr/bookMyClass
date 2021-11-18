import styles from "../../styles/home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Classrooms = () => {
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [endPending, setEndPending] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();

  useEffect(() => {
    getAllClassrooms();
  }, []);

  const getAllClassrooms = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get("/classrooms", {}, axiosConfig)
      .then((res) => {
        console.log(res.data);
        setAllClassrooms(res.data.classrooms);
        console.log(allClassrooms, "successful seed!");
        setEndPending(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else {
          toast.error("An error occured. Try again!");
        }
        console.log("error in client", e);
        setEndPending(true);
      });
  };

  return (
    <div className="myClassrooms">
      <div className="col-sm-8 offset-sm-2">
        {endPending && (
          <div className="containerClassrooms">
            <div className="Classrooms card">
              <div
                className="card-head"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div className="card-title">My Classrooms</div>
                <div className="card-class" style={{ marginLeft: "auto" }}>
                  <a href="/classrooms/new">
                    <img src="https://img.icons8.com/ios-filled/50/ffffff/plus.png" />
                  </a>
                </div>
              </div>
            </div>
            <div className="searchBar input-group">
              <input
                className="input-group rounded searchBar"
                type="text"
                id="search"
                name="search"
                autoComplete="off"
                placeholder="search by subject .."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span
                className="input-group-text border-0"
                id="search-addon"
                style={{ background: "transparent", display: "inline-block" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>
            </div>
            <div className="row">
              {allClassrooms &&
                allClassrooms.map((classroom) =>
                  classroom.subject
                    .toLowerCase()
                    .includes(search.toLowerCase()) ? (
                    <div className="col-lg-6 col-xl-4 d-flex align-items">
                      <div className="icon-box">
                        <div className="icon">
                          <i class="bx bx-book-open"></i>
                        </div>
                        <Link
                          to={`/classrooms/${classroom._id}`}
                          title={`${classroom.classname} - Section ${classroom.section}`}
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                          }}
                        >
                          <h4
                            className={styles.h4}
                            style={{ color: "#eb5d1e" }}
                          >
                            {classroom.classname} - Section {classroom.section}
                          </h4>
                          <p className="description">{classroom.subject}</p>
                        </Link>
                      </div>
                    </div>
                  ) : null
                )}
              {!allClassrooms.some((classroom) =>
                classroom.subject.toLowerCase().includes(search.toLowerCase())
              ) ? (
                <h3
                  style={{
                    textAlign: "center",
                    margin: "auto",
                    fontSize: 20,
                    fontWeight: 350,
                  }}
                >
                  No classrooms to show.
                </h3>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Classrooms;
