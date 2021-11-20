import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const NewClassroom = () => {
  const [classname, setClassname] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
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
        "/classrooms/create",
        {
          classname: classname,
          subject: subject,
          section: section,
        },
        axiosConfig
      )
      .then((res) => {
        console.log("created classroom");
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
          console.log("error in client", e);
        }
      });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setIsPending(true);
    console.log(".....");
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/classrooms/join",
        {
          code: code,
        },
        axiosConfig
      )
      .then((res) => {
        console.log("joined classroom");
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
        console.log("error in client", e);
      });
  };

  return (
    <div className="newClassroom">
      <section class="forms-section">
        <div class="forms">
          <div class="form-wrapper is-active">
            <button type="button" class="switcher switcher-create">
              Create Classroom
              <span class="underline"></span>
            </button>
            <form onSubmit={handleCreate} class="formClassroom form-create">
              <fieldset>
                <p className="info-classroom">
                  Enter details to generate a classroom as its teacher
                </p>
                <div class="input-block">
                  <input
                    id="class"
                    type="text"
                    name="class"
                    placeholder="Class"
                    required
                    autoFocus
                    value={classname}
                    onChange={(event) => setClassname(event.target.value)}
                  />
                </div>
                <div class="input-block notFirst">
                  <input
                    id="section"
                    type="text"
                    name="section"
                    placeholder="Section"
                    required
                    value={section}
                    onChange={(event) => setSection(event.target.value)}
                  />
                </div>
                <div class="input-block notFirst">
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    required
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>
              </fieldset>
              {!isPending && (
                <button type="submit" class="btn-create">
                  Submit
                </button>
              )}
              {isPending && (
                <button type="submit" class="btn-create disabled">
                  Submit
                </button>
              )}
            </form>
          </div>
          <div class="form-wrapper">
            <button type="button" class="switcher switcher-join">
              Join Classroom
              <span class="underline"></span>
            </button>
            <form class="formClassroom form-join" onSubmit={handleJoin}>
              <fieldset>
                <div class="input-block">
                  <label for="classroomCode">Classroom Code</label>
                  <p className="info-classroom">
                    (The teacher would provide this code)
                  </p>
                  <input
                    id="code"
                    type="text"
                    name="code"
                    placeholder="Code"
                    required
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </div>
              </fieldset>
              {!isPending && (
                <button type="submit" class="btn-join">
                  Join
                </button>
              )}
              {isPending && (
                <button type="submit" class="btn-join disabled">
                  Join
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewClassroom;
