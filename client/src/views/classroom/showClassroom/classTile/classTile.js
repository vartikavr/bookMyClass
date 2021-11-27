import "./classTile.css";
import SeatBookingButton from "./seatBookingButton";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ClassTitle = ({
  currentClass,
  classroom,
  currentDate,
  currentUser,
  isProcessPending,
  isProcessGoingOn,
  isClassDeleted,
  isSeatBooked,
}) => {
  const history = useHistory();
  const handleDeleteClass = (event) => {
    const classId = event.target.id;
    isClassDeleted(false);
    isProcessGoingOn(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete(`/api/class/${classId}/delete`, {}, axiosConfig)
      .then((res) => {
        toast.success("Successfully deleted a class!");
        isClassDeleted(true);
        isProcessGoingOn(false);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else {
          toast.error("An error occured. Try again!");
        }
        isClassDeleted(false);
        isProcessGoingOn(false);
      });
  };

  return (
    <div className="col-lg-6 col-xl-4 offset-2 offset-lg-0 d-flex align-items">
      <div className="flipCard" title={currentClass.title}>
        <div className="flipCardInner">
          <div className="flipCardFront">
            <div className="icon">
              <i className="bx bxs-spreadsheet"></i>
            </div>
            <h4 className="classHeading">{currentClass.title}</h4>
          </div>
          <div className="flipCardBack">
            <h5 title="">{currentClass.date.substring(0, 10)}</h5>
            <p className="time mb-2" title="">
              Time : {currentClass.startTime} to {currentClass.endTime} (IST)
            </p>
            <p title="">Available seats : {currentClass.availableSeats}</p>
            {classroom.teacher !== currentUser._id &&
              !currentUser.classes.includes(currentClass._id) &&
              currentClass.date.substring(0, 10) >= currentDate && (
                <SeatBookingButton
                  currentClass={currentClass}
                  isSeatBooked={isSeatBooked}
                  isProcessPending={isProcessPending}
                  isProcessGoingOn={isProcessGoingOn}
                />
              )}
            {classroom.teacher !== currentUser._id &&
              currentUser.classes.includes(currentClass._id) &&
              currentClass.date.substring(0, 10) >= currentDate && (
                <button className="btn disabled" title="Class Booked">
                  Booked
                </button>
              )}
            {classroom.teacher !== currentUser._id &&
              currentClass.date.substring(0, 10) < currentDate && (
                <button className="btn disabled" title="Class Expired">
                  Ended
                </button>
              )}
            {classroom.teacher === currentUser._id && (
              <div className="teacherButtons">
                {!isProcessPending && (
                  <button
                    className="me-3"
                    title=""
                    id={currentClass._id}
                    onClick={handleDeleteClass}
                  >
                    Delete
                  </button>
                )}
                {isProcessPending && (
                  <button
                    className="me-3"
                    title=""
                    id={currentClass._id}
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    &nbsp;Delete
                  </button>
                )}
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
  );
};

export default ClassTitle;
