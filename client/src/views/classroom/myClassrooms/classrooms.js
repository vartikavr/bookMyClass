import styles from "../../../styles/home.module.css";
import Searchbar from "./searchbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactLoading from "react-loading";
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
    setEndPending(false);
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
    <div className="myClassrooms mb-4">
      {!endPending && (
        <div className="pageLoading">
          <ReactLoading
            type={"balls"}
            color={"#ff4b2b"}
            height={80}
            width={80}
          />
        </div>
      )}
      {endPending && (
        <div className="col-sm-8 offset-sm-2">
          <div className="containerClassrooms">
            <div className="Classrooms card">
              <div className="card-head">
                <div className="card-title">My Classrooms</div>
                <div className="card-class" style={{ marginLeft: "auto" }}>
                  <Link to="/classrooms/new">
                    <img src="https://img.icons8.com/ios-filled/50/ffffff/plus.png" />
                  </Link>
                </div>
              </div>
            </div>
            <Searchbar searchValue={search} changeSearchValue={setSearch} />
            <div className="row">
              {allClassrooms &&
                allClassrooms.map((classroom) =>
                  classroom.subject
                    .toLowerCase()
                    .includes(search.toLowerCase()) ? (
                    <div className="col-lg-6 col-xl-4 d-flex align-items">
                      <div className="icon-box">
                        <Link
                          to={`/classrooms/${classroom._id}`}
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                          }}
                        >
                          <div className="icon">
                            <i class="bx bx-book-open"></i>
                          </div>
                          <h4
                            className={styles.h4}
                            title={`${classroom.classname} - Section ${classroom.section}`}
                            style={{ color: "#eb5d1e" }}
                          >
                            {classroom.classname} - Section {classroom.section}
                          </h4>
                          <p
                            className="description"
                            title={`${classroom.subject}`}
                          >
                            {classroom.subject}
                          </p>
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
        </div>
      )}
    </div>
  );
};
export default Classrooms;
