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
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

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
        console.log("class added");
        toast.success("New class scheduled!");
        history.push(`/classrooms/${classroomId}`);
      })
      .catch((res, e) => {
        toast.error("Invalid entry. Please try again!");
        console.log("error in client", e);
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
                        required
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </div>
                    <div className="time mb-3">
                      <input
                        className="form-control"
                        type="time"
                        id="startTime"
                        name="startTime"
                        placeholder="Start Time"
                        title="Enter start time"
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
                        title="Enter end time"
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
                        placeholder="in-person seats (optional)"
                        value={seats}
                        onChange={(event) => setSeats(event.target.value)}
                      />
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-block mt-2 mb-4">
                        Submit
                      </button>
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
