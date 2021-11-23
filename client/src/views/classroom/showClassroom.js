import styles from "../../styles/class.module.css";
import stylesHome from "../../styles/home.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ShowClassroom = () => {
  const { id: classroomId } = useParams();
  const [classroom, setClassroom] = useState([]);
  const [endPending, setEndPending] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [isClassDeleted, setIsClassDeleted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getClassroomInfo();
  }, [isBooked, isClassDeleted]);

  const getClassroomInfo = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/classrooms/${classroomId}`, {}, axiosConfig)
      .then((res) => {
        console.log(res.data);
        setClassroom(res.data.currentClassroom);
        setCurrentUser(res.data.user);
        console.log(classroom, "successful seed!");
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

  const handleDeleteClassroom = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete(`/classrooms/${classroomId}/delete`, {}, axiosConfig)
      .then((res) => {
        console.log("successfully deleted classroom!");
        toast.success("Successfully deleted a classroom!");
        history.push("/classrooms");
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
      });
  };

  const handleDeleteClass = (event) => {
    const classId = event.target.id;
    setIsClassDeleted(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete(`/class/${classId}/delete`, {}, axiosConfig)
      .then((res) => {
        console.log("successfully deleted class!");
        toast.success("Successfully deleted a class!");
        setIsClassDeleted(true);
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
        setIsClassDeleted(false);
        console.log("error in client", e);
      });
  };

  const handleSeatBooking = (event) => {
    const classId = event.target.id;
    setIsBooked(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/class/${classId}/book`, {}, axiosConfig)
      .then((res) => {
        console.log("successfully booked class!");
        toast.success("Successfully booked the class!");
        setIsBooked(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else if (e.response.data.isQualifiedForBooking == false) {
          toast.error(
            "Student needs to be either under 18 age or fully vaccinated to book an in-person class!"
          );
        } else if (e.response.data.isSeatLeft == false) {
          toast.error("Sorry, all available seats are booked!");
        } else if (e.response.data.isClassroomMember == false) {
          toast.error("You've not joined this classroom yet!");
        } else {
          toast.error("An error occured while booking. Try again!");
        }
        console.log("error in client", e);
        setIsBooked(false);
      });
  };
  const openDropdown = () => {
    let menuContent = document.querySelector(".menu-content");
    if (menuContent.style.display === "") {
      menuContent.style.display = "block";
    } else {
      menuContent.style.display = "";
    }
  };

  const redirectToAddClass = () => {
    history.push(`/classrooms/${classroomId}/new`);
  };

  const redirectToPeople = () => {
    history.push(`/classrooms/${classroomId}/people`);
  };

  return (
    <div className="showClassroom mb-4">
      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Classroom Code
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style={{ wordWrap: "break-word" }}>
              {classroom.code}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
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
                <div className="card-title">
                  <Link
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      cursor: "text",
                    }}
                    title={`${classroom.classname} - Section ${classroom.section}`}
                  >
                    {classroom.classname} - Section {classroom.section}
                  </Link>
                </div>
                <div
                  class="card-class dropdown-menu-classroom"
                  style={{ marginLeft: "auto" }}
                >
                  <button className="menu-btn" onClick={openDropdown}>
                    <img src="https://img.icons8.com/ios-glyphs/30/ffffff/menu-2.png" />
                  </button>
                  <div className="menu-content" id="menu-content">
                    {currentUser._id == classroom.teacher && (
                      <button
                        class="links"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                      >
                        Classroom Code
                      </button>
                    )}
                    {currentUser._id == classroom.teacher && (
                      <button
                        class="links delete"
                        onClick={handleDeleteClassroom}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      class="links people"
                      to={`/classsrooms/${classroom._id}/people`}
                      onClick={redirectToPeople}
                    >
                      People
                    </button>
                  </div>
                </div>
              </div>
              <div className="title-text">{classroom.subject}</div>
            </div>
            <div className="showClassroomBody">
              {currentUser._id == classroom.teacher && (
                <div className="classroom-btn">
                  <button className="btn-addClass" onClick={redirectToAddClass}>
                    Add Class
                  </button>
                </div>
              )}
              <div className="row">
                {classroom.classes.length > 0 ? (
                  classroom.classes.map((currentClass) => (
                    <div className="col-lg-6 col-xl-4 offset-2 offset-lg-0 d-flex align-items">
                      <div class={styles.flipCard} title={currentClass.title}>
                        <div class={styles.flipCardInner}>
                          <div class={styles.flipCardFront}>
                            <div className="icon">
                              <i class="bx bxs-spreadsheet"></i>
                            </div>
                            <h4 className={stylesHome.h4}>
                              {currentClass.title}
                            </h4>
                          </div>
                          <div class={styles.flipCardBack}>
                            <h5 title="">
                              {currentClass.date.substring(0, 10)}
                            </h5>
                            <p className="time mb-2" title="">
                              Time : {currentClass.startTime} to{" "}
                              {currentClass.endTime}
                            </p>
                            <p title="">
                              Available seats : {currentClass.availableSeats}
                            </p>
                            {classroom.teacher != currentUser._id &&
                              !currentUser.classes.includes(
                                currentClass._id
                              ) && (
                                <button
                                  title="Book seat for in-person class"
                                  id={currentClass._id}
                                  onClick={handleSeatBooking}
                                >
                                  Book seat
                                </button>
                              )}
                            {classroom.teacher != currentUser._id &&
                              currentUser.classes.includes(
                                currentClass._id
                              ) && (
                                <button className="btn disabled" title="">
                                  Booked
                                </button>
                              )}
                            {classroom.teacher == currentUser._id && (
                              <div className="teacherButtons">
                                <button
                                  className="me-3"
                                  title=""
                                  id={currentClass._id}
                                  onClick={handleDeleteClass}
                                >
                                  Delete
                                </button>
                                <button title="">
                                  <Link
                                    to={`/class/${currentClass._id}/seats`}
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    Roster
                                  </Link>
                                </button>
                              </div>
                            )}
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

export default ShowClassroom;
