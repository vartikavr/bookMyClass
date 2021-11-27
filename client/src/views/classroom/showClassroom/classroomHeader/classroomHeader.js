import "./classroomHeader.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ClassroomHeader = ({
  classroom,
  currentUser,
  openDropdown,
  redirectToPeople,
  isDeleting,
  isDeletionPending,
}) => {
  const history = useHistory();
  const handleDeleteClassroom = () => {
    isDeletionPending(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete(`/api/classrooms/${classroom._id}/delete`, {}, axiosConfig)
      .then((res) => {
        toast.success("Successfully deleted a classroom!");
        history.push("/classrooms");
        isDeletionPending(false);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else {
          toast.error("An error occured. Try again!");
        }
        isDeletionPending(false);
      });
  };

  return (
    <div className="Classrooms card">
      <div className="card-head">
        <div className="card-title">
          <Link
            style={{
              color: "inherit",
              textDecoration: "none",
              cursor: "text",
            }}
            title={`${classroom.classname} - Section ${classroom.section}`}
          >
            {classroom.classname} - Section {classroom.section}
          </Link>
        </div>
        <div
          class="card-class dropdown-menu-classroom"
          style={{ marginLeft: "auto" }}
        >
          <button className="menu-btn" onClick={openDropdown}>
            <img src="https://img.icons8.com/ios-glyphs/30/ffffff/menu-2.png" />
          </button>
          <div className="menu-content" id="menu-content">
            {currentUser._id == classroom.teacher && (
              <button
                class="links"
                data-toggle="modal"
                data-target="#codeModalCenter"
              >
                Classroom Code
              </button>
            )}
            {currentUser._id == classroom.teacher && (
              <button
                class="links"
                data-toggle="modal"
                data-target="#editModalCenter"
              >
                Edit
              </button>
            )}
            {currentUser._id == classroom.teacher && (
              <div>
                {!isDeleting && (
                  <button class="links" onClick={handleDeleteClassroom}>
                    Delete
                  </button>
                )}
                {isDeleting && (
                  <button class="links" disabled>
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    &nbsp; Delete
                  </button>
                )}
              </div>
            )}
            <button
              class="links"
              to={`/classsrooms/${classroom._id}/people`}
              onClick={redirectToPeople}
            >
              People
            </button>
          </div>
        </div>
      </div>
      <div className="title-text">{classroom.subject}</div>
    </div>
  );
};

export default ClassroomHeader;
