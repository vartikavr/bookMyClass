import "./resetPassword.css";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ResetPasswordForm from "./resetPasswordForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
toast.configure();

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

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
        `/reset/${token}`,
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
        } else if (e.response.data.isMatch == false) {
          toast.error("Invalid entry! Passwords do not match");
        } else {
          toast.error("Invalid entry. Please try again!");
          console.log("error in client ...", e);
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
