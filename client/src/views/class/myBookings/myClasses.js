import "./myClasses.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClassTile from "./classTile";
import ClassButtons from "./classButtons";
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
