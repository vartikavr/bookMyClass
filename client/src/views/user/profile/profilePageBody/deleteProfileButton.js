import axios from "axios";
import { useHistory } from "react-router-dom";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

//set whether profile deletion is in-process or not
const DeleteProfileButton = ({ isProfileDeleting }) => {
  const history = useHistory();

  //handle profile deletion in backend
  const handleDeleteProfile = () => {
    isProfileDeleting(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete("/api/delete", {}, axiosConfig)
      .then((res) => {
        isProfileDeleting(false);
        toast.success("Successfully deleted the user's profile!");
        history.push("/");
      })
      .catch((e) => {
        isProfileDeleting(false);
        toast.error("An error occured. Try again!");
      });
  };

  return (
    <button className="profile-links" onClick={handleDeleteProfile}>
      Delete Profile
    </button>
  );
};

export default DeleteProfileButton;
