import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const EditProfileModal = ({
  name,
  changeName,
  vaccineStatus,
  changeVaccineStatus,
  isUserInfoEdited,
}) => {
  const history = useHistory();
  const handleEditProfile = () => {
    isUserInfoEdited(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/api/edit",
        {
          name: name,
          vaccineStatus: vaccineStatus,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Successfully edited the user details!");
        isUserInfoEdited(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else {
          toast.error("An error occured. Try again!");
        }
        isUserInfoEdited(false);
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
              Edit User Details
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
                  <b>Name:</b>
                </label>
                <input
                  style={{ outline: "none", width: "70%" }}
                  className="ms-2"
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => changeName(event.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">
                  <b>Vaccine Status:</b>
                </label>
                <select
                  className="ms-2"
                  style={{ outline: "none", width: "70%" }}
                  name="vaccineStatus"
                  required
                  title="Vaccination status"
                  value={vaccineStatus}
                  onChange={(event) => changeVaccineStatus(event.target.value)}
                >
                  <option value="" selected hidden>
                    {vaccineStatus}
                  </option>
                  <option
                    value="Below 18"
                    disabled={vaccineStatus == "Below 18"}
                  >
                    Under 18 age
                  </option>
                  <option
                    value="First Dose"
                    disabled={vaccineStatus == "First Dose"}
                  >
                    First dose done
                  </option>
                  <option
                    value="Second Dose"
                    disabled={vaccineStatus == "Second Dose"}
                  >
                    Second dose done
                  </option>
                  <option value="NOTA" disabled={vaccineStatus == "NOTA"}>
                    NOTA
                  </option>
                </select>
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
              onClick={handleEditProfile}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
