import styles from "../../../styles/login.module.css";

const RegisterForm = ({
  name,
  changeName,
  vaccineStatus,
  changeVaccineStatus,
  email,
  changeEmail,
  password,
  changePassword,
  handleRegisterSubmit,
  isRegisterPending,
}) => {
  return (
    <div className="formContainer signUpContainer">
      <form className={styles.form} onSubmit={handleRegisterSubmit}>
        <h3 className={styles.h3}>Create Account</h3>
        <input
          className={styles.input}
          name="name"
          id="name"
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(event) => changeName(event.target.value)}
        />
        <select
          className={styles.input}
          name="vaccineStatus"
          required
          title="Vaccination status"
          value={vaccineStatus}
          onChange={(event) => changeVaccineStatus(event.target.value)}
        >
          <option value="" selected hidden>
            Vaccination status
          </option>
          <option value="Below 18">Under 18 age</option>
          <option value="First Dose">First dose done</option>
          <option value="Second Dose">Second dose done</option>
          <option value="NOTA">NOTA</option>
        </select>
        <input
          className={styles.input}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
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
        {!isRegisterPending && <button className="buttonLogin">Sign Up</button>}
        {isRegisterPending && (
          <button className="buttonLogin" disabled>
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp; Sign Up
          </button>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
