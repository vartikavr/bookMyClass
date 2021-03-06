import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const EditClassroomModal = ({
  //get and set(change) the following values in the form
  classname,
  section,
  subject,
  changeClassname,
  changeSection,
  changeSubject,
  //check is classroom has been edited or not
  isClassroomModified,
  //getclassroom id value
  classroomId,
}) => {
  const history = useHistory();

  //handle updation of classroom info in backend
  const handleEditClassroom = () => {
    isClassroomModified(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `/api/classrooms/${classroomId}/edit`,
        {
          classname: classname,
          subject: subject,
          section: section,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Successfully edited the classroom details!");
        isClassroomModified(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else {
          toast.error("An error occured. Try again!");
        }
        isClassroomModified(false);
      });
  };
  return (
    <div
      className="modal fade"
      id="editModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editModalLongTitle">
              Edit Classroom Details
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
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
