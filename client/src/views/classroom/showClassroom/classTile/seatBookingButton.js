import { useHistory } from "react-router-dom";
import axios from "axios";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const SeatBookingButton = ({
  currentClass, //get current class info
  isSeatBooked, //check whether the class is booked or not
  isProcessPending, //check whether the booking seat action is in-process or not
  isProcessGoingOn, //set the value whether booking of class is in-process or not
}) => {
  const history = useHistory();

  //handle seat booking in backend
  const handleSeatBooking = (event) => {
    const classId = event.target.id;
    isSeatBooked(false);
    isProcessGoingOn(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/class/${classId}/book`, {}, axiosConfig)
      .then((res) => {
        toast.success("Successfully booked the class!");
        isSeatBooked(true);
        isProcessGoingOn(false);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else if (e.response.data.isQualifiedForBooking === false) {
          toast.error(
            "As per govt. guidelines, student needs to be either under 18 age or fully vaccinated to book an in-person class!"
          );
        } else if (e.response.data.isSeatLeft === false) {
          toast.error("Sorry, all available seats are booked!");
        } else if (e.response.data.isClassroomMember === false) {
          toast.error("You've not joined this classroom yet!");
        } else {
          toast.error("An error occured while booking. Try again!");
        }
        isSeatBooked(false);
        isProcessGoingOn(false);
      });
  };

  return (
    <div className="seatBookingButton">
      {!isProcessPending && (
        <button
          title="Book seat for in-person class"
          id={currentClass._id}
          onClick={handleSeatBooking}
        >
          Book seat
        </button>
      )}
      {isProcessPending && (
        <button title="" id={currentClass._id} disabled>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          &nbsp; Booking..
        </button>
      )}
    </div>
  );
};

export default SeatBookingButton;
