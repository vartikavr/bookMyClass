const ClassButtons = ({
  selectedButton,
  handleAll,
  handleExpired,
  handleUpcoming,
}) => {
  return (
    <div class="btn-group mt-4" role="group" aria-label="Basic example">
      <button
        type="button"
        class={`btn ${selectedButton == "all" ? " selected" : ""}`}
        onClick={handleAll}
      >
        All
      </button>
      <button
        type="button"
        class={`btn ms-5 ${selectedButton == "upcoming" ? " selected" : ""}`}
        id="upcomingBtn"
        onClick={handleUpcoming}
      >
        Upcoming
      </button>
      <button
        type="button"
        class={`btn ms-5 ${selectedButton == "expired" ? " selected" : ""}`}
        id="expiredBtn"
        onClick={handleExpired}
      >
        Expired
      </button>
    </div>
  );
};

export default ClassButtons;
