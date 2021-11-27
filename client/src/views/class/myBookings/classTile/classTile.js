import "./classTile.css";
import axios from "axios";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ClassTile = ({
  currentClass,
  currentDate,
  isBookingCancelled,
  changeSelectedButton,
}) => {
  const [isCancellationPending, setIsCancellationPending] = useState(false);
  const history = useHistory();

  const handleCancelBooking = (event) => {
    isBookingCancelled(false);
    setIsCancellationPending(true);
    const classId = event.target.id;
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/class/${classId}/cancel`, {}, axiosConfig)
      .then((res) => {
        toast.success("Successfully cancelled booking!");
        isBookingCancelled(true);
        setIsCancellationPending(false);
        changeSelectedButton("all");
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
        isBookingCancelled(false);
        setIsCancellationPending(false);
        changeSelectedButton("all");
      });
  };

  return (
    <div className="col-lg-6 col-xl-4 offset-lg-0 d-flex align-items justify-content-center">
      <div class="flipCard" title={currentClass.title}>
        <div class="flipCardInner">
          <div class="flipCardFrontBooking">
            <div className="icon">
              <i class="bx bxs-spreadsheet"></i>
            </div>
            <h4 className="classHeading">{currentClass.title}</h4>
          </div>
          <div class="flipCardBackBooking">
            <h5 title="">{currentClass.date.substring(0, 10)}</h5>
            <p className="time mb-2" title="">
              Time : {currentClass.startTime} to {currentClass.endTime} (IST)
            </p>
            <p title="">Available seats : {currentClass.availableSeats}</p>
            {currentClass.date.substring(0, 10) >= currentDate && (
              <div>
                {!isCancellationPending && (
                  <button
                    className="cancelBtn"
                    title=""
                    id={currentClass._id}
                    onClick={handleCancelBooking}
                  >
                    Cancel Booking
                  </button>
                )}
                {isCancellationPending && (
                  <button
                    className="cancelBtn"
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
            {currentClass.date.substring(0, 10) < currentDate && (
              <button className="endedBtn" title="Class Expired" disabled>
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
  );
};

export default ClassTile;
