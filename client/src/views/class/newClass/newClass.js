import "./newClass.css";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewClassForm from "./newClassForm";
toast.configure();

const NewClass = () => {
  //get the classroom id from url
  const { id: classroomId } = useParams();
  //get the values of title, date, startTime, endTime,
  //available (in-person) seats from the form
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [seats, setSeats] = useState("");
  //check if form is in the process of being submittted
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
  //get current date
  const currentDate = getDate.getFullYear() + "-" + month + "-" + dateToday;

  //handle form submission for creating a new class in the classroom
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
        `/api/classrooms/${classroomId}/new`,
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
        toast.success("New class scheduled!");
        history.push(`/classrooms/${classroomId}`);
        setIsPending(false);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else if (e.response.data.isClassroomTeacher === false) {
          toast.error(
            "An error occured! Only the classroom's teacher can create new classes."
          );
          history.push("/classrooms");
        } else {
          toast.error("Invalid entry. Please try again!");
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
