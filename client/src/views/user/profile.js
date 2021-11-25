import { useState, useEffect } from "react/cjs/react.development";
import styles from "../../styles/profile.module.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Profile = () => {
  const [user, setUser] = useState({});
  const [endPending, setEndPending] = useState(false);
  const [changedEmail, setChangedEmail] = useState("");
  const [name, setName] = useState("");
  const [vaccineStatus, setVaccineStatus] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [isPendingChange, setIsPendingChange] = useState(false);
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getUserDetails();
  }, [isEdited]);

  useEffect(() => {
    const form = document.getElementById("form");
    document.getElementById("submitBtnEmail").disabled = true;
    form.addEventListener("change", () => {
      document.getElementById("submitBtnEmail").disabled =
        !form.checkValidity();
    });
  }, [changedEmail]);

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

  const handleChangeEmail = () => {
    setIsEdited(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/edit/email", { changedEmail: changedEmail }, axiosConfig)
      .then((res) => {
        console.log("successfully updated email!");
        toast.success(
          "Email id updated! Check your mails to confirm new email id."
        );
        setIsEdited(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isOldEmail) {
          toast.error("Error occured! Old email id entered.");
        } else if (e.response.data.isEmailExisting) {
          toast.error(
            "Error occured! Entered email id already registered on our website."
          );
        } else {
          toast.error("An error occured. Try again!");
        }
        console.log("error in client", e);
        setEndPending(true);
        setIsEdited(false);
      });
  };

  const handleChangePassword = () => {
    setIsPendingChange(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/reset",
        {
          email: user.email,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Check email to reset password!");
        console.log("change password mail sent");
        setIsPendingChange(false);
      })
      .catch((res, e) => {
        toast.error("An error occured. Please try again!");
        console.log(res.error, "error in client ...", e);
        setIsPendingChange(false);
      });
  };

  const handleEditProfile = () => {
    setIsEdited(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/edit",
        {
          name: name,
          vaccineStatus: vaccineStatus,
        },
        axiosConfig
      )
      .then((res) => {
        console.log("successfully edited profile!");
        toast.success("Successfully edited the user details!");
        setIsEdited(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else {
          toast.error("An error occured. Try again!");
        }
        console.log("error in client", e);
        setIsEdited(false);
      });
  };

  const handleDeleteProfile = () => {
    setIsPendingDelete(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete("/delete", {}, axiosConfig)
      .then((res) => {
        setIsPendingDelete(false);
        console.log("successfully deleted profile!");
        toast.success("Successfully deleted the user's profile!");
        localStorage.removeItem("isLoggedIn");
        console.log("logging out..");
        history.push("/");
      })
      .catch((e) => {
        setIsPendingDelete(false);
        toast.error("An error occured. Try again!");
        console.log("error in client", e);
      });
  };

  return (
    <div className={styles.profile}>
      <div
        class="modal fade"
        id="emailModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="emailModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="emailModalLongTitle">
                Enter new email id
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
              <form id="form">
                <label className="form-label">
                  <b>Email id:</b>
                </label>
                <input
                  style={{ outline: "none" }}
                  className="ms-2"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={changedEmail}
                  onChange={(event) => setChangedEmail(event.target.value)}
                />
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
                id="submitBtnEmail"
                onClick={handleChangeEmail}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
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
                    onChange={(event) => setName(event.target.value)}
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
                    onChange={(event) => setVaccineStatus(event.target.value)}
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
          <div class="row">
            <div class="profile-nav col-md-4">
              <div class="panel">
                <div class="user-heading round">
                  <a href="#">
                    <img src="https://img.icons8.com/external-bearicons-glyph-bearicons/128/ffffff/external-User-essential-collection-bearicons-glyph-bearicons.png" />
                  </a>
                  <h1>{user.name}</h1>
                  <p>{user.email}</p>
                </div>
                <div className="profileBtns mb-2">
                  <button className="profile-links active">My Profile</button>
                  <button
                    className="profile-links"
                    data-toggle="modal"
                    data-target="#editModalCenter"
                  >
                    Edit Profile
                  </button>
                  {!isPendingDelete && (
                    <button
                      className="profile-links"
                      onClick={handleDeleteProfile}
                    >
                      Delete Profile
                    </button>
                  )}
                  {isPendingDelete && (
                    <button className="profile-links" disabled>
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      &nbsp;Deleting..
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div class="profile-info col-md-8">
              <div class="panel">
                <div class="bio-graph-heading">User Profile</div>
                <div class="panel-body bio-graph-info mt-3 ms-4">
                  <h1 style={{ fontWeight: "600" }}>Account Details</h1>
                  <div class="row">
                    <div class="bio-row mb-2">
                      <p>
                        <span>Name </span>: {user.name}
                      </p>
                    </div>
                    <div class="bio-row mb-2">
                      <p>
                        <span>Email id </span>: {user.email}
                      </p>
                    </div>
                    <div class="bio-row mb-2">
                      <p>
                        <span>Email id confirmed </span>: {"" + user.isVerified}
                      </p>
                    </div>
                    <div class="bio-row mb-2">
                      {user.vaccineStatus == "Below 18" && (
                        <p>
                          <span>Vaccination Status </span>: Not vaccinated,
                          below 18 age
                        </p>
                      )}
                      {user.vaccineStatus == "First Dose" && (
                        <p>
                          <span>Vaccination Status </span>: Only first dose of
                          vaccine received
                        </p>
                      )}
                      {user.vaccineStatus == "Second Dose" && (
                        <p>
                          <span>Vaccination Status </span>: Second dose of
                          vaccine received
                        </p>
                      )}
                      {user.vaccineStatus == "NOTA" && (
                        <p>
                          <span>Vaccination Status </span>: Not vaccinated
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="profile-actions mt-2 ms-4">
                  <div className="actionBtn">
                    <button
                      type="button"
                      class="btn email"
                      data-toggle="modal"
                      data-target="#emailModalCenter"
                    >
                      Change Email
                    </button>
                  </div>
                  <div className="actionBtn">
                    {!isPendingChange && (
                      <button
                        type="button"
                        class="btn password"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </button>
                    )}
                    {isPendingChange && (
                      <button type="button" class="btn password" disabled>
                        <span
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        &nbsp; Processing..
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
