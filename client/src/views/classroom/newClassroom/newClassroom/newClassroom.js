import "./newClassroom.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoinClassroom from "../joinClassroom/joinClassroom";
import CreateClassroom from "../createClassroom/createClassroom";
toast.configure();

const NewClassroom = () => {
  //get and set the classname, subject, section and classroom code values from the forms
  const [classname, setClassname] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  //check whether the processes - creation or joining of a classroom are in-process or not
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const switchers = [...document.querySelectorAll(".switcher")];

    switchers.forEach((item) => {
      item.addEventListener("click", function () {
        switchers.forEach((item) =>
          item.parentElement.classList.remove("is-active")
        );
        this.parentElement.classList.add("is-active");
      });
    });
  }, []);

  //handle creation of a classroom in backend
  const handleCreate = (e) => {
    e.preventDefault();
    setIsPending(true);

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/api/classrooms/create",
        {
          classname: classname,
          subject: subject,
          section: section,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Successfully created classroom!");
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((e) => {
        setIsPending(false);
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/classrooms");
        } else {
          toast.error("Invalid entry. Please try again!");
        }
      });
  };

  //handle joining of a classroom in backend
  const handleJoin = (e) => {
    e.preventDefault();
    setIsPending(true);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/api/classrooms/join",
        {
          code: code,
        },
        axiosConfig
      )
      .then((res) => {
        toast.success("Successfully joined classroom!");
        history.push("/classrooms");
        setIsPending(false);
      })
      .catch((e) => {
        setIsPending(false);
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error Occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/classrooms");
        } else {
          toast.error("Invalid entry. Please try again!");
        }
      });
  };

  return (
    <div className="newClassroom">
      <section className="forms-section">
        <div className="forms">
          <CreateClassroom
            classname={classname}
            changeClassname={setClassname}
            section={section}
            changeSection={setSection}
            subject={subject}
            changeSubject={setSubject}
            isCreationPending={isPending}
            handleCreate={handleCreate}
          />
          <JoinClassroom
            code={code}
            changeCode={setCode}
            isJoiningPending={isPending}
            handleJoin={handleJoin}
          />
        </div>
      </section>
    </div>
  );
};

export default NewClassroom;
