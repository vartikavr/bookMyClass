import "./newClass.css";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewClassForm from "./newClassForm";
toast.configure();

const NewClass = () => {
  const { id: classroomId } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [seats, setSeats] = useState("");
  const [isPending, setIsPending] = useState("");
  const history = useHistory();
  const getDate = new Date();
  var month = getDate.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var dateToday = getDate.getDate();
  if (dateToday < 10) {
    dateToday = "0" + dateToday;
  }
  const currentDate = getDate.getFullYear() + "-" + month + "-" + dateToday;
  // const currentDate = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `/classrooms/${classroomId}/new`,
        {
          title: title,
          startTime: startTime,
          endTime: endTime,
          date: date,
          seats: seats,
        },
        axiosConfig
      )
      .then((res) => {
        console.log("class added", res);
        toast.success("New class scheduled!");
        history.push(`/classrooms/${classroomId}`);
        setIsPending(false);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else if (e.response.data.isClassroomTeacher == false) {
          toast.error(
            "An error occured! Only the classroom's teacher can create new classes."
          );
          history.push("/classrooms");
        } else {
          toast.error("Invalid entry. Please try again!");
          console.log("error in client", e);
        }
        setIsPending(false);
      });
  };

  return (
    <div className="newClass">
      <div className="container mb-5 mt-5">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow">
            <div className="row g-0">
              <div className="card-image col-xl-7">
                <img
                  src={`${process.env.PUBLIC_URL}/createClass.svg`}
                  alt=""
                  className="card-img"
                />
              </div>
              <div className="card-body-cover col-xl-4 me-2">
                <div className="card-body">
                  <h5
                    className="card-title text-center mt-4"
                    style={{ fontSize: 40, color: "#f88138" }}
                  >
                    Schedule class
                  </h5>
                  <NewClassForm
                    currentDate={currentDate}
                    handleSubmit={handleSubmit}
                    title={title}
                    changeTitle={setTitle}
                    date={date}
                    changeDate={setDate}
                    startTime={startTime}
                    changeStartTime={setStartTime}
                    endTime={endTime}
                    changeEndTime={setEndTime}
                    seats={seats}
                    changeSeats={setSeats}
                    isFormSubmitted={isPending}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default NewClass;
