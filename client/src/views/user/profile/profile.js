import { useState, useEffect } from "react";
import ChangeEmailModal from "./changeEmailModal";
import EditProfileModal from "./editProfileModal";
import ProfilePageBody from "./profilePageBody";
import styles from "../../../styles/profile.module.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Profile = () => {
  const [user, setUser] = useState({});
  const [endPending, setEndPending] = useState(false);
  const [name, setName] = useState("");
  const [vaccineStatus, setVaccineStatus] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getUserDetails();
  }, [isEdited]);

  const getUserDetails = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get("/profile", {}, axiosConfig)
      .then((res) => {
        setUser(res.data.user);
        setName(res.data.user.name);
        setVaccineStatus(res.data.user.vaccineStatus);
        console.log(res.data, "successful seed!");
        setEndPending(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else {
          toast.error("An error occured. Try again!");
        }
        console.log("error in client", e);
        setEndPending(true);
      });
  };

  return (
    <div className={styles.profile}>
      <ChangeEmailModal isEmailChanged={setIsEdited} />
      <EditProfileModal
        name={name}
        changeName={setName}
        vaccineStatus={vaccineStatus}
        changeVaccineStatus={setVaccineStatus}
        isUserInfoEdited={setIsEdited}
      />
      {!endPending && (
        <div className="pageLoading">
          <ReactLoading
            type={"balls"}
            color={"#ff4b2b"}
            height={80}
            width={80}
          />
        </div>
      )}
      {endPending && (
        <div class="container bootstrap snippets">
          <ProfilePageBody user={user} />
        </div>
      )}
    </div>
  );
};

export default Profile;
