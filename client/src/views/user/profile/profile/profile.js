import { useState, useEffect } from "react";
import ChangeEmailModal from "./changeEmailModal";
import EditProfileModal from "./editProfileModal";
import ProfilePageBody from "../profilePageBody/profilePageBody";
import "./profile.css";
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
    // eslint-disable-next-line
  }, [isEdited]);

  const getUserDetails = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get("/api/profile", {}, axiosConfig)
      .then((res) => {
        setUser(res.data.user);
        setName(res.data.user.name);
        setVaccineStatus(res.data.user.vaccineStatus);
        setEndPending(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else {
          toast.error("An error occured. Try again!");
        }
        setEndPending(true);
      });
  };

  return (
    <div className="profile">
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
        <div className="container bootstrap snippets">
          <ProfilePageBody user={user} />
        </div>
      )}
    </div>
  );
};

export default Profile;
