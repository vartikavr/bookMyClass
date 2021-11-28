import "./classButtons.css";

// all, upcoming and expired buttons in MyBookings
const ClassButtons = ({
  selectedButton, //which button out of three is selected right now
  handleAll,
  handleExpired,
  handleUpcoming,
}) => {
  return (
    <div className="btn-group mt-4" role="group" aria-label="Basic example">
      <button
        type="button"
        className={`btn ${selectedButton === "all" ? " selected" : ""}`}
        onClick={handleAll}
      >
        All
      </button>
      <button
        type="button"
        className={`btn ms-5 ${
          selectedButton === "upcoming" ? " selected" : ""
        }`}
        id="upcomingBtn"
        onClick={handleUpcoming}
      >
        Upcoming
      </button>
      <button
        type="button"
        className={`btn ms-5 ${
          selectedButton === "expired" ? " selected" : ""
        }`}
        id="expiredBtn"
        onClick={handleExpired}
      >
        Expired
      </button>
    </div>
  );
};

export default ClassButtons;
