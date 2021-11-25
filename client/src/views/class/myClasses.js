import styles from "../../styles/class.module.css";
import stylesHome from "../../styles/home.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const MyClasses = () => {
  const [endPending, setEndPending] = useState(false);
  const [bookedClasses, setBookedClasses] = useState([]);
  var selected = "all";
  const [selectedState, setSelectedState] = useState("all");
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const date = new Date();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var dateToday = date.getDate();
  if (dateToday < 10) {
    dateToday = "0" + dateToday;
  }
  const currentDate = date.getFullYear() + "-" + month + "-" + dateToday;
  // const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getClassesInfo();
  }, [isCancelled]);

  const getClassesInfo = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/class", { selected: selected }, axiosConfig)
      .then((res) => {
        console.log(res.data);
        setBookedClasses(res.data.classes);
        console.log("successful seed!");
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

  const handleAll = () => {
    selected = "all";
    setSelectedState("all");
    getClassesInfo();
  };

  const handleUpcoming = () => {
    selected = "upcoming";
    setSelectedState("upcoming");
    getClassesInfo();
  };

  const handleExpired = () => {
    selected = "expired";
    setSelectedState("expired");
    getClassesInfo();
  };

  const handleCancelBooking = (event) => {
    setIsCancelled(false);
    setIsPending(true);
    const classId = event.target.id;
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/class/${classId}/cancel`, {}, axiosConfig)
      .then((res) => {
        console.log(res.data);
        console.log("successful cancelation!");
        toast.success("Successfully cancelled booking!");
        setIsCancelled(true);
        setIsPending(false);
        selected = "all";
        setSelectedState("all");
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
        setIsCancelled(false);
        setIsPending(false);
        selected = "all";
        setSelectedState("all");
      });
  };

  return (
    <div className="myClasses">
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
            <h1 className="ms-2" style={{ color: "#f88138" }}>
              My booked classes
            </h1>
            <hr style={{ color: "black" }} />
            <h5 className="ms-2 me-2" style={{ fontWeight: "100" }}>
              Following are your booked in-person classes, sorted by date and
              time. Classes are considered expired when their scheduled date is
              surpassed.
            </h5>
            <div class="btn-group mt-4" role="group" aria-label="Basic example">
              <button
                type="button"
                class={`btn ${selectedState == "all" ? " selected" : ""}`}
                onClick={handleAll}
              >
                All
              </button>
              <button
                type="button"
                class={`btn ms-5 ${
                  selectedState == "upcoming" ? " selected" : ""
                }`}
                id="upcomingBtn"
                onClick={handleUpcoming}
              >
                Upcoming
              </button>
              <button
                type="button"
                class={`btn ms-5 ${
                  selectedState == "expired" ? " selected" : ""
                }`}
                id="expiredBtn"
                onClick={handleExpired}
              >
                Expired
              </button>
            </div>
            <div className="myClassesBody">
              <div className="row">
                {bookedClasses.length > 0 ? (
                  bookedClasses.map((currentClass) => (
                    <div className="col-lg-6 col-xl-4 offset-2 offset-lg-0 d-flex align-items">
                      <div class={styles.flipCard} title={currentClass.title}>
                        <div class={styles.flipCardInner}>
                          <div class={styles.flipCardFrontBooking}>
                            <div className="icon">
                              <i class="bx bxs-spreadsheet"></i>
                            </div>
                            <h4 className={stylesHome.h4}>
                              {currentClass.title}
                            </h4>
                          </div>
                          <div class={styles.flipCardBackBooking}>
                            <h5 title="">
                              {currentClass.date.substring(0, 10)}
                            </h5>
                            <p className="time mb-2" title="">
                              Time : {currentClass.startTime} to{" "}
                              {currentClass.endTime} (IST)
                            </p>
                            <p title="">
                              Available seats : {currentClass.availableSeats}
                            </p>
                            {currentClass.date.substring(0, 10) >=
                              currentDate && (
                              <div>
                                {!isPending && (
                                  <button
                                    className={styles.cancelBtn}
                                    title=""
                                    id={currentClass._id}
                                    onClick={handleCancelBooking}
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                                {isPending && (
                                  <button
                                    className={styles.cancelBtn}
                                    title=""
                                    id={currentClass._id}
                                    disabled
                                  >
                                    <span
                                      class="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    &nbsp; Cancel
                                  </button>
                                )}
                              </div>
                            )}
                            {currentClass.date.substring(0, 10) <
                              currentDate && (
                              <button
                                className={styles.endedBtn}
                                title="Class Expired"
                                disabled
                              >
                                Ended
                              </button>
                            )}
                            <Link
                              to={`/classrooms/${currentClass.classroom._id}`}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              <button className="mt-2 viewBtn" title="">
                                View Classroom
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h3
                    style={{
                      textAlign: "center",
                      margin: "auto",
                      fontSize: 20,
                      fontWeight: 400,
                    }}
                    className="mt-4"
                  >
                    No classes to show.
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;
