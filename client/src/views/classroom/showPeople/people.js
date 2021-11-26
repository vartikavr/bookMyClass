import styles from "../../../styles/people.module.css";
import SendInvite from "./sendInvite";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const People = () => {
  const { id: classroomId } = useParams();
  const [classroom, setClassroom] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [email, setEmail] = useState("");
  const [endPending, setEndPending] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getPeopleInfo();
  }, []);

  useEffect(() => {
    const form = document.getElementById("form");
    document.getElementById("submitBtnEmail").disabled = true;
    form.addEventListener("change", () => {
      document.getElementById("submitBtnEmail").disabled =
        !form.checkValidity();
    });
  }, [email]);

  const getPeopleInfo = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/classrooms/${classroomId}`, {}, axiosConfig)
      .then((res) => {
        console.log(res.data);
        setClassroom(res.data.currentClassroom);
        setTeacherInfo(res.data.teacher);
        setCurrentUser(res.data.user);
        console.log(classroom, "successful seed!");
        setEndPending(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else {
          toast.error("An error occured. Try again!");
        }
        console.log("error in client", e);
        setEndPending(true);
      });
  };

  return (
    <div className={styles.showPeople}>
      <SendInvite
        email={email}
        changeEmail={setEmail}
        classroomId={classroom._id}
      />
      {!endPending && (
        <div className="pageLoading">
          <ReactLoading
            type={"balls"}
            color={"#ff4b2b"}
            height={80}
            width={80}
          />
        </div>
      )}
      {endPending && (
        <div className="col-sm-8 offset-sm-2">
          <div className="peopleBody">
            <h1 style={{ color: "#f88138" }}>Teacher</h1>
            <hr style={{ color: "black" }} />
            <h5 className="ms-4">{teacherInfo.name}</h5>
            <div className={styles.studentsHeading}>
              <h1 style={{ color: "#f88138" }} className="mt-4">
                Students
              </h1>
              {teacherInfo._id == currentUser._id && (
                <button
                  className={styles.inviteBtn}
                  data-toggle="modal"
                  data-target="#inviteModalCenter"
                >
                  Invite
                </button>
              )}
            </div>
            <hr style={{ color: "black" }} />
            {classroom.students.length > 0 ? (
              <table class="table table-hover">
                <thead style={{ color: "#f88138" }}>
                  <tr>
                    <th scope="col" style={{ width: "10%" }}>
                      #
                    </th>
                    <th scope="col" style={{ width: "40%" }}>
                      Name
                    </th>
                    <th scope="col" style={{ width: "50%" }}>
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classroom.students.map((student, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h3
                style={{
                  textAlign: "center",
                  margin: "auto",
                  fontSize: 20,
                  fontWeight: 400,
                }}
                className="mt-4"
              >
                No students to show.
              </h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default People;
