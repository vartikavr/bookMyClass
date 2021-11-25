import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
                  <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        autoFocus
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="date"
                        id="date"
                        name="date"
                        placeholder="Date"
                        title="Enter date"
                        min={currentDate}
                        required
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </div>
                    <label className="mb-2">Start and End time in IST :</label>
                    <div className="time mb-3">
                      <input
                        className="form-control"
                        type="time"
                        id="startTime"
                        name="startTime"
                        placeholder="Start Time"
                        title="Enter start time in IST"
                        required
                        value={startTime}
                        onChange={(event) => setStartTime(event.target.value)}
                      />
                      <p className="mt-2" style={{ alignContent: "center" }}>
                        &nbsp;to&nbsp;
                      </p>
                      <input
                        className="form-control"
                        type="time"
                        id="endTime"
                        name="endTime"
                        placeholder="End Time"
                        title="Enter end time in IST"
                        required
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        id="seats"
                        name="seats"
                        title="Enter total no. of in-person seats"
                        placeholder="in-person seats (optional)"
                        value={seats}
                        onChange={(event) => setSeats(event.target.value)}
                      />
                    </div>
                    <div className="d-grid">
                      {!isPending && (
                        <button className="btn btn-block mt-2 mb-4">
                          Submit
                        </button>
                      )}
                      {isPending && (
                        <button className="btn btn-block mt-2 mb-4" disabled>
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          &nbsp;Submit
                        </button>
                      )}
                    </div>
                  </form>
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
