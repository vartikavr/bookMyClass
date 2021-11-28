import "./profilePageBody.css";
import DeleteProfileButton from "./deleteProfileButton";
import ChangePasswordButton from "./changePasswordButton";
import { useState } from "react";

const ProfilePageBody = ({ user }) => {
  //check whether profile deletion action is going-on or not
  const [isDeletePending, setIsDeletePending] = useState(false);
  //check whether change password action is going-on or not
  const [isChangePasswordPending, setIsChangePasswordPending] = useState(false);

  return (
    <div className="row">
      <div className="profile-nav col-md-4">
        <div className="panel">
          <div className="user-heading round">
            {/* eslint-disable-next-line */}
            <a href="">
              <img
                alt=""
                src="https://img.icons8.com/external-bearicons-glyph-bearicons/128/ffffff/external-User-essential-collection-bearicons-glyph-bearicons.png"
              />
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
            {!isDeletePending && (
              <DeleteProfileButton isProfileDeleting={setIsDeletePending} />
            )}
            {isDeletePending && (
              <button className="profile-links" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                &nbsp;Deleting..
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="profile-info col-md-8">
        <div className="panel">
          <div className="bio-graph-heading">User Profile</div>
          <div className="panel-body bio-graph-info mt-3 ms-4">
            <h1 style={{ fontWeight: "600" }}>Account Details</h1>
            <div className="row">
              <div className="bio-row mb-2">
                <p>
                  <span>Name </span>: {user.name}
                </p>
              </div>
              <div className="bio-row mb-2">
                <p>
                  <span>Email id </span>: {user.email}
                </p>
              </div>
              <div className="bio-row mb-2">
                <p>
                  <span>Email id confirmed </span>: {"" + user.isVerified}
                </p>
              </div>
              <div className="bio-row mb-2">
                {user.vaccineStatus === "Below 18" && (
                  <p>
                    <span>Vaccination Status </span>: Not vaccinated, below 18
                    age
                  </p>
                )}
                {user.vaccineStatus === "First Dose" && (
                  <p>
                    <span>Vaccination Status </span>: Only first dose of vaccine
                    received
                  </p>
                )}
                {user.vaccineStatus === "Second Dose" && (
                  <p>
                    <span>Vaccination Status </span>: Second dose of vaccine
                    received
                  </p>
                )}
                {user.vaccineStatus === "NOTA" && (
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
                className="btn email"
                data-toggle="modal"
                data-target="#emailModalCenter"
              >
                Change Email
              </button>
            </div>
            <div className="actionBtn">
              {!isChangePasswordPending && (
                <ChangePasswordButton
                  email={user.email}
                  isPasswordChanging={setIsChangePasswordPending}
                />
              )}
              {isChangePasswordPending && (
                <button type="button" className="btn password" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
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
  );
};

export default ProfilePageBody;
