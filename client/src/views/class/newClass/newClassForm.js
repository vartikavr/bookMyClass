import "./newClassForm.css";
const NewClassForm = ({
  title,
  changeTitle,
  date,
  changeDate,
  startTime,
  changeStartTime,
  endTime,
  changeEndTime,
  seats,
  changeSeats,
  handleSubmit,
  currentDate,
  isFormSubmitted,
}) => {
  return (
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
          onChange={(event) => changeTitle(event.target.value)}
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
          onChange={(event) => changeDate(event.target.value)}
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
          onChange={(event) => changeStartTime(event.target.value)}
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
          onChange={(event) => changeEndTime(event.target.value)}
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
          onChange={(event) => changeSeats(event.target.value)}
        />
      </div>
      <div className="d-grid">
        {!isFormSubmitted && (
          <button className="formsubmit-btn btn-block mt-2 mb-4">Submit</button>
        )}
        {isFormSubmitted && (
          <button className="formsubmit-btn btn-block mt-2 mb-4" disabled>
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
  );
};

export default NewClassForm;
