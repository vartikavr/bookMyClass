import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ChangeEmailModal = ({ isEmailChanged }) => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  useEffect(() => {
    const form = document.getElementById("form");
    document.getElementById("submitBtnEmail").disabled = true;
    form.addEventListener("change", () => {
      document.getElementById("submitBtnEmail").disabled =
        !form.checkValidity();
    });
  }, [email]);

  const handleChangeEmail = () => {
    isEmailChanged(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/edit/email", { changedEmail: email }, axiosConfig)
      .then((res) => {
        toast.success(
          "Email id updated! Check your mails to confirm new email id."
        );
        isEmailChanged(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isOldEmail) {
          toast.error("Error occured! Old email id entered.");
        } else if (e.response.data.isEmailExisting) {
          toast.error(
            "Error occured! Entered email id already registered on our website."
          );
        } else {
          toast.error("An error occured. Try again!");
        }
        isEmailChanged(false);
      });
  };

  return (
    <div
      class="modal fade"
      id="emailModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="emailModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="emailModalLongTitle">
              Enter new email id
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
                onChange={(event) => setEmail(event.target.value)}
              />
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              id="submitBtnEmail"
              onClick={handleChangeEmail}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
