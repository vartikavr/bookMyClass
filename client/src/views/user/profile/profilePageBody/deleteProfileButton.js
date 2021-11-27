import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const DeleteProfileButton = ({ isProfileDeleting }) => {
  const history = useHistory();
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
