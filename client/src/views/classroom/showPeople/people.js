import "./people.css";
import SendInvite from "./sendInvite";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// loader while page information is being fetched from backend
import ReactLoading from "react-loading";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const People = () => {
  //get classroom id from url
  const { id: classroomId } = useParams();
  //get and set classroom info
  const [classroom, setClassroom] = useState([]);
  //get and set classroom's teacher's info
  const [teacherInfo, setTeacherInfo] = useState({});
  //get and set current user's info
  const [currentUser, setCurrentUser] = useState({});
  //get and set email id to send invite to
  const [email, setEmail] = useState("");
  //check whether page information has been fetched from backend or not
  const [endPending, setEndPending] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getPeopleInfo();
    // eslint-disable-next-line
  }, []);

  //enable submit button on invite modal only when valid email id is entered
  useEffect(() => {
    const form = document.getElementById("form");
    document.getElementById("submitBtnEmail").disabled = true;
    form.addEventListener("change", () => {
      document.getElementById("submitBtnEmail").disabled =
        !form.checkValidity();
    });
  }, [email]);

  //get the info about the people of the classrooom from backend
  const getPeopleInfo = () => {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/classrooms/${classroomId}`, {}, axiosConfig)
      .then((res) => {
        setClassroom(res.data.currentClassroom);
        setTeacherInfo(res.data.teacher);
        setCurrentUser(res.data.user);
        setEndPending(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn === false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified === false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else {
          toast.error("An error occured. Try again!");
        }
        setEndPending(true);
      });
  };

  return (
    <div className="showPeople">
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
            <div className="studentsHeading">
              <h1 style={{ color: "#f88138" }} className="mt-4">
                Students
              </h1>
              {/* check whether current user is classroom's teacher or not */}
              {teacherInfo._id === currentUser._id && (
                <button
                  className="inviteBtn"
                  data-toggle="modal"
                  data-target="#inviteModalCenter"
                >
                  Invite
                </button>
              )}
            </div>
            <hr style={{ color: "black" }} />
            {classroom.students.length > 0 ? (
              <table className="table table-hover">
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
