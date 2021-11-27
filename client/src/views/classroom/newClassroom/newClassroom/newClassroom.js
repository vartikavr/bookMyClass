import "./newClassroom.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoinClassroom from "../joinClassroom/joinClassroom";
import CreateClassroom from "../createClassroom/createClassroom";
toast.configure();

const NewClassroom = () => {
  const [classname, setClassname] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
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
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/classrooms");
        } else {
          toast.error("Invalid entry. Please try again!");
        }
      });
  };

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
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error Occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/classrooms");
        } else {
          toast.error("Invalid entry. Please try again!");
        }
      });
  };

  return (
    <div className="newClassroom">
      <section class="forms-section">
        <div class="forms">
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
