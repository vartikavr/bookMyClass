import "./confirmEmail.css";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { WifiLoader } from "react-awesome-loaders";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ConfirmEmail = () => {
  const { token } = useParams();
  const [isPending, setIsPending] = useState(false);

  const verifyEmail = () => {
    setIsPending(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/confirmation/${token}`, {}, axiosConfig)
      .then((res) => {
        toast.success("Email confirmed!");
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("User not logged in. Try again!");
          history.push("/login");
        } else {
          toast.error("An error occured while confirming email. Try again!");
          history.push("/classrooms");
        }
        setIsPending(false);
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
      {!isPending && <button onClick={verifyEmail}>Confirm Email</button>}
      {isPending && (
        <button disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          &nbsp;Confirm Email
        </button>
      )}
    </div>
  );
};

export default ConfirmEmail;
