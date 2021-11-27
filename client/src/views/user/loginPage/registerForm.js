import "./registerForm.css";

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
      <form className="registerForm" onSubmit={handleRegisterSubmit}>
        <h3 className="heading">Create Account</h3>
        <input
          className="input-register"
          name="name"
          id="name"
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(event) => changeName(event.target.value)}
        />
        <select
          className="input-register"
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
          className="input-register"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => changeEmail(event.target.value)}
        />
        <input
          className="input-register"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => changePassword(event.target.value)}
        />
        {!isRegisterPending && (
          <button className="buttonRegister">Sign Up</button>
        )}
        {isRegisterPending && (
          <button className="buttonRegister" disabled>
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
