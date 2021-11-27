import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
toast.configure();

const ForgotPasswordModal = () => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    const form = document.getElementById("forgotPasswordForm");
    document.getElementById("submitBtnEmail").disabled = true;
    form.addEventListener("change", () => {
      document.getElementById("submitBtnEmail").disabled =
        !form.checkValidity();
    });
  }, [email]);

  const sendResetPasswordEmail = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/api/reset",
        {
          email: email,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Check email to reset password!");
        console.log("forgot password mail sent");
      })
      .catch((res, e) => {
        toast.error("An error occured. Please try again!");
        console.log(res.error, "error in client ...", e);
      });
  };

  return (
    <div
      class="modal fade"
      id="forgotPasswordModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="forgotPasswordModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="forgotPasswordModalLongTitle">
              Enter your registered email id
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
            <form id="forgotPasswordForm">
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
              onClick={sendResetPasswordEmail}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
