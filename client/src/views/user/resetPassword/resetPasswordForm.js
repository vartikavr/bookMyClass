import "./resetPasswordForm.css";

const ResetPasswordForm = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  isPasswordSubmitting,
}) => {
  return (
    <div className="card-body">
      <h5
        className="card-title mb-3"
        style={{ fontSize: 30, color: "#f88138" }}
      >
        Reset Password
      </h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" for="username">
            New Password
          </label>
          <input
            className="form-control"
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="new pasword"
            required
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" for="password">
            Confirm Password
          </label>
          <input
            className="form-control"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="confirm password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <div className="d-grid mt-4">
          {!isPasswordSubmitting && (
            <button
              className="btn"
              style={{
                backgroundColor: "#f88138",
                color: "#fff",
              }}
            >
              Submit
            </button>
          )}
          {isPasswordSubmitting && (
            <button
              className="btn"
              disabled
              style={{
                backgroundColor: "#f88138",
                color: "#fff",
              }}
            >
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              &nbsp; Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
