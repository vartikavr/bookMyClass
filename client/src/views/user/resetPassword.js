import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
toast.configure();

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        `/reset/${token}`,
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Password successfully changed!");
        history.push("/login");
      })
      .catch((e) => {
        setNewPassword("");
        setConfirmPassword("");
        if (e.response.data.isOldPassword) {
          toast.error("Invalid entry! Old password entered.");
        } else if (e.response.data.isMatch == false) {
          toast.error("Invalid entry! Passwords do not match");
        } else {
          toast.error("Invalid entry. Please try again!");
          console.log("error in client ...", e);
        }
      });
  };

  return (
    <div className="resetPassword">
      <div className="container d-flex justify-content-center">
        <div className="card shadow">
          <div className="card-body">
            <h5
              className="card-title mb-3"
              style={{ fontSize: 30, color: "#f88138" }}
            >
              Reset Password
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" for="username">
                  New Password
                </label>
                <input
                  className="form-control"
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="new pasword"
                  required
                  autoFocus
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" for="password">
                  Confirm Password
                </label>
                <input
                  className="form-control"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="confirm password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
              <div className="d-grid mt-4">
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#f88138",
                    color: "#fff",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
