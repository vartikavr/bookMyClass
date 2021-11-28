import "./myClasses.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClassTile from "../classTile/classTile";
import ClassButtons from "../classButtons/classButtons";
// loader while page information is being fetched from backend
import ReactLoading from "react-loading";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const MyClasses = () => {
  //check whether page information has been fetched from backend or not
  const [endPending, setEndPending] = useState(false);
  //get the values of the booked classes
  const [bookedClasses, setBookedClasses] = useState([]);
  //select which button out of (all, upcoming and expired) is selected
  var selected = "all";
  //change selected state from - all, upcoming, expired
  const [selectedState, setSelectedState] = useState("all");
  //check whether a booking is cancelled or not
  const [isCancelled, setIsCancelled] = useState(false);
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
  //get current date
  const currentDate = date.getFullYear() + "-" + month + "-" + dateToday;

  useEffect(() => {
    getClassesInfo();
    // eslint-disable-next-line
  }, [isCancelled]);

  //get the information about the class from backend
  const getClassesInfo = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/api/class", { selected: selected }, axiosConfig)
      .then((res) => {
        setBookedClasses(res.data.classes);
        setEndPending(true);
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
        setEndPending(true);
      });
  };

  //action to be performed when "all" button selected
  const handleAll = () => {
    selected = "all";
    setSelectedState("all");
    getClassesInfo();
  };

  //action to be performed when "upcoming" button selected
  const handleUpcoming = () => {
    selected = "upcoming";
    setSelectedState("upcoming");
    getClassesInfo();
  };

  //action to be performed when "expired" button selected
  const handleExpired = () => {
    selected = "expired";
    setSelectedState("expired");
    getClassesInfo();
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
            <ClassButtons
              changeSelectedState={setSelectedState}
              selectedButton={selectedState}
              getClassesInfo={getClassesInfo}
              selected={selected}
              handleAll={handleAll}
              handleUpcoming={handleUpcoming}
              handleExpired={handleExpired}
            />
            <div className="myClassesBody">
              <div className="row">
                {bookedClasses.length > 0 ? (
                  bookedClasses.map((currentClass) => (
                    <ClassTile
                      currentDate={currentDate}
                      currentClass={currentClass}
                      isBookingCancelled={setIsCancelled}
                      changeSelectedButton={setSelectedState}
                    />
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
