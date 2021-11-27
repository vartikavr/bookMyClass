import "./login.css";
import ForgotPasswordModal from "./forgotPasswordModal";
import RegisterForm from "../registerForm/registerForm";
import SignInForm from "../signInForm/signInForm";
import OverlayContainer from "../overlayContainer/overlayContainer";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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
        "/api/register",
        {
          name: name,
          email: email,
          password: password,
          vaccineStatus: vaccineStatus,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success(
          "Successfully Registered! Check your mails to confirm your email id."
        );
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((e) => {
        setIsPending(false);
        setPassword("");
        if (e.response.data.isAlreadyLoggedIn) {
          toast.error("User already logged in!");
          history.push("/");
        } else if (e.response.data.isEmailExisting) {
          toast.error(
            "Invalid entry! Email already registered on our website."
          );
        } else {
          toast.error("Invalid entry. Please try again!");
        }
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
        "/api/login",
        {
          email: email,
          password: password,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Logged in!");
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((e) => {
        setPassword("");
        setIsPending(false);
        if (e.response.data.isAlreadyLoggedIn) {
          toast.error("User already logged in!");
          history.push("/");
        } else {
          toast.error("Invalid email or password. Please try again!");
        }
      });
  };

  return (
    <div className="login">
      <ForgotPasswordModal />
      <div className="login-container" id="container">
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
