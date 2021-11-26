import styles from "../../../styles/login.module.css";

const SignInForm = ({
  email,
  changeEmail,
  password,
  changePassword,
  handleLoginSubmit,
  isSigninPending,
}) => {
  return (
    <div className="formContainer signInContainer">
      <form className={styles.form} onSubmit={handleLoginSubmit}>
        <h1 className={styles.h1}>Sign in</h1>
        <input
          className={styles.input}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
          autoFocus
          value={email}
          onChange={(event) => changeEmail(event.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => changePassword(event.target.value)}
        />
        <a
          href=""
          className={styles.forgotPasswordLink}
          data-toggle="modal"
          data-target="#forgotPasswordModalCenter"
        >
          Forgot your password?
        </a>
        {!isSigninPending && <button className="buttonLogin">Sign In</button>}
        {isSigninPending && (
          <button className="buttonLogin" disabled>
            <span
              class="spinner-border spinner-border-sm"
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
