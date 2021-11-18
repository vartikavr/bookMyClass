import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { WifiLoader } from "react-awesome-loaders";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ConfirmEmail = () => {
  const { token } = useParams();

  const verifyEmail = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/confirmation/${token}`, {}, axiosConfig)
      .then((res) => {
        console.log("email confirmed");
        toast.success("Email confirmed!");
        history.push("/classrooms");
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("User not logged in. Try again!");
          history.push("/login");
        } else {
          toast.error("An error occured while confirming email. Try again!");
          history.push("/classrooms");
        }
        console.log("error in client ...", e);
      });
  };
  const history = useHistory();

  return (
    <div className="confirmEmail">
      <WifiLoader
        background={"transparent"}
        desktopSize={"150px"}
        mobileSize={"150px"}
        text={""}
        backColor="#E8F2FC"
        frontColor="#ff4b2b"
      />
      <button onClick={verifyEmail}>Confirm Email</button>
    </div>
  );
};

export default ConfirmEmail;
