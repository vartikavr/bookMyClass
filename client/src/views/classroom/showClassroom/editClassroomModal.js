import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const EditClassroomModal = ({
  classname,
  section,
  subject,
  changeClassname,
  changeSection,
  changeSubject,
  isClassroomModified,
  classroomId,
}) => {
  const history = useHistory();
  const handleEditClassroom = () => {
    isClassroomModified(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `/classrooms/${classroomId}/edit`,
        {
          classname: classname,
          subject: subject,
          section: section,
        },
        axiosConfig
      )
      .then((res) => {
        console.log("successfully edited classroom!");
        toast.success("Successfully edited the classroom details!");
        isClassroomModified(true);
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
        console.log("error in client", e);
        isClassroomModified(false);
      });
  };
  return (
    <div
      class="modal fade"
      id="editModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLongTitle">
              Edit Classroom Details
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div className="mb-2">
                <label className="form-label">
                  <b>Class:</b>
                </label>
                <input
                  style={{ outline: "none", width: "70%" }}
                  className="ms-2"
                  id="class"
                  type="text"
                  name="class"
                  value={classname}
                  onChange={(event) => changeClassname(event.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">
                  <b>Section:</b>
                </label>
                <input
                  style={{ outline: "none", width: "70%" }}
                  className="ms-2"
                  id="section"
                  type="text"
                  name="section"
                  value={section}
                  onChange={(event) => changeSection(event.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">
                  <b>Subject:</b>
                </label>
                <input
                  style={{ outline: "none", width: "70%" }}
                  className="ms-2"
                  id="subject"
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(event) => changeSubject(event.target.value)}
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              onClick={handleEditClassroom}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClassroomModal;
