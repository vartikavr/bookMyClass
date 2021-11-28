import "./signInForm.css";

const SignInForm = ({
  //get and set(change) email, password values in the form
  email,
  changeEmail,
  password,
  changePassword,
  //handle login action in backend
  handleLoginSubmit,
  //check whether sign-in(login) action is in-process or not
  isSigninPending,
}) => {
  return (
    <div className="formContainer signInContainer">
      <form className="signin-form" onSubmit={handleLoginSubmit}>
        <h1 className="heading">Sign in</h1>
        <input
          className="input-signin"
          type="email"
          name="email"
          id="emailLogin"
          placeholder="Email"
          required
          autoFocus
          value={email}
          onChange={(event) => changeEmail(event.target.value)}
        />
        <input
          className="input-signin"
          type="password"
          name="password"
          id="passwordLogin"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => changePassword(event.target.value)}
        />
        {/* eslint-disable-next-line */}
        <a
          href=""
          className="forgotPasswordLink"
          data-toggle="modal"
          data-target="#forgotPasswordModalCenter"
        >
          Forgot your password?
        </a>
        {!isSigninPending && <button className="buttonLogin">Sign In</button>}
        {isSigninPending && (
          <button className="buttonLogin" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp; Sign In
          </button>
        )}
      </form>
    </div>
  );
};

export default SignInForm;
