import axios from "axios";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

//email => get email id of the current user
//isPasswordChanging => set whether the sending mail for changing password action is in-process or not
const ChangePasswordButton = ({ email, isPasswordChanging }) => {
  //handle sending changing password mail in backend
  const handleChangePassword = () => {
    isPasswordChanging(true);
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
        isPasswordChanging(false);
      })
      .catch((res, e) => {
        toast.error("An error occured. Please try again!");
        isPasswordChanging(false);
      });
  };

  return (
    <button
      type="button"
      className="btn password"
      onClick={handleChangePassword}
    >
      Change Password
    </button>
  );
};

export default ChangePasswordButton;
