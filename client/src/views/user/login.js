import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import styles from "../../styles/login.module.css";
toast.configure();

const Login = () => {
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("rightPanelActive");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("rightPanelActive");
    });
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vaccineStatus, setVaccineStatus] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/register",
        {
          name: name,
          email: email,
          password: password,
          vaccineStatus: vaccineStatus,
        },
        axiosConfig
      )
      .then((res) => {
        localStorage.setItem("isLoggedIn", true);
        //console.log(localStorage.getItem('isLoggedIn'), "login done");
        console.log("registration done");
        toast.success(
          "Successfully Registered! Check your mails to confirm your email id."
        );
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((res, e) => {
        setIsPending(false);
        toast.error("Invalid entry. Please try again!");
        console.log("error in client", e);
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/login",
        {
          email: email,
          password: password,
        },
        axiosConfig
      )
      .then((res) => {
        localStorage.setItem("isLoggedIn", true);
        console.log("login done");
        toast.success("Logged in!");
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((res, e) => {
        setPassword("");
        toast.error("Invalid email or password. Please try again!");
        console.log(res.error, "error in client ...", e);
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles.container} id="container">
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
              onChange={(event) => setName(event.target.value)}
            />
            <select
              className={styles.input}
              name="vaccineStatus"
              required
              value={vaccineStatus}
              onChange={(event) => setVaccineStatus(event.target.value)}
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
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {!isPending && <button className="buttonLogin">Sign Up</button>}
            {isPending && (
              <button className="buttonLogin disabled">Sign Up</button>
            )}
          </form>
        </div>
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <a className={styles.a} href="#">
              Forgot your password?
            </a>
            {!isPending && <button className="buttonLogin">Sign In</button>}
            {isPending && (
              <button className="buttonLogin disabled">Sign In</button>
            )}
          </form>
        </div>
        <div className="overlayContainer">
          <div className="overlay">
            <div className="overlayPanel overlayLeft">
              <h1 className={styles.h1}>Welcome Back!</h1>
              <p className={styles.p}>
                To keep connected with us please login with your personal info
              </p>
              <button className="buttonLogin ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlayPanel overlayRight">
              <h1 className={styles.h1}>Hello!</h1>
              <p className={styles.p}>
                Enter your details and get connected with us within seconds
              </p>
              <button className="buttonLogin ghost" id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
