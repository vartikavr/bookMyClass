import "./resetPassword.css";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ResetPasswordForm from "./resetPasswordForm";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
toast.configure();

const ResetPassword = () => {
  //get token value from url
  const { token } = useParams();
  //get and set new password, confirm password values in form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //check if the reset password action is in-process or not
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  //handle reset password form submission in backend
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
        `/api/reset/${token}`,
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Password successfully changed!");
        setIsPending(false);
        history.push("/login");
      })
      .catch((e) => {
        setNewPassword("");
        setConfirmPassword("");
        if (e.response.data.isOldPassword) {
          toast.error("Invalid entry! Old password entered.");
        } else if (e.response.data.isMatch === false) {
          toast.error("Invalid entry! Passwords do not match");
        } else {
          toast.error("Invalid entry. Please try again!");
        }
        setIsPending(false);
      });
  };

  return (
    <div className="resetPassword">
      <div className="container d-flex justify-content-center">
        <div className="card shadow">
          <ResetPasswordForm
            handleSubmit={handleSubmit}
            password={newPassword}
            setPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isPasswordSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
