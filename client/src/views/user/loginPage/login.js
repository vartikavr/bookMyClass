import ForgotPasswordModal from "./forgotPasswordModal";
import RegisterForm from "./registerForm";
import SignInForm from "./signInForm";
import OverlayContainer from "./overlayContainer";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import styles from "../../../styles/login.module.css";
toast.configure();

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vaccineStatus, setVaccineStatus] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

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
      .catch((e) => {
        setIsPending(false);
        setPassword("");
        if (e.response.data.isEmailExisting) {
          toast.error(
            "Invalid entry! Email already registered on our website."
          );
        } else {
          toast.error("Invalid entry. Please try again!");
        }
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
      .catch((e) => {
        setPassword("");
        setIsPending(false);
        toast.error("Invalid email or password. Please try again!");
        console.log("error in client ...", e);
      });
  };

  return (
    <div className={styles.login}>
      <ForgotPasswordModal />
      <div className={styles.container} id="container">
        <RegisterForm
          name={name}
          changeName={setName}
          email={email}
          changeEmail={setEmail}
          vaccineStatus={vaccineStatus}
          changeVaccineStatus={setVaccineStatus}
          password={password}
          changePassword={setPassword}
          handleRegisterSubmit={handleRegisterSubmit}
          isRegisterPending={isPending}
        />
        <SignInForm
          email={email}
          changeEmail={setEmail}
          password={password}
          changePassword={setPassword}
          handleLoginSubmit={handleLoginSubmit}
          isSigninPending={isPending}
        />
        <OverlayContainer />
      </div>
    </div>
  );
};

export default Login;
