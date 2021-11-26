import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ChangePasswordButton = ({ email, isPasswordChanging }) => {
  const handleChangePassword = () => {
    isPasswordChanging(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/reset",
        {
          email: email,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Check email to reset password!");
        console.log("change password mail sent");
        isPasswordChanging(false);
      })
      .catch((res, e) => {
        toast.error("An error occured. Please try again!");
        console.log(res.error, "error in client ...", e);
        isPasswordChanging(false);
      });
  };

  return (
    <button type="button" class="btn password" onClick={handleChangePassword}>
      Change Password
    </button>
  );
};

export default ChangePasswordButton;
