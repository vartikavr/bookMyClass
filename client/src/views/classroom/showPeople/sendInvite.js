import axios from "axios";
import { useHistory } from "react-router-dom";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

//get and set(change) email id value in the form
const SendInvite = ({ email, changeEmail, classroomId }) => {
  const history = useHistory();

  //handle sending invite to the entered email id in the backend
  const sendInvite = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `/api/classrooms/${classroomId}/invite`,
        {
          email: email,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Successfully sent invite!");
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/classrooms");
        } else {
          toast.error("An error occured. Please try again!");
        }
      });
  };

  return (
    <div
      className="modal fade"
      id="inviteModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="inviteModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="inviteModalLongTitle">
              Enter student's email id to send an invite
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form id="form">
              <label className="form-label">
                <b>Email id:</b>
              </label>
              <input
                style={{ outline: "none" }}
                className="ms-2"
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(event) => changeEmail(event.target.value)}
              />
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
              id="submitBtnEmail"
              onClick={sendInvite}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendInvite;
