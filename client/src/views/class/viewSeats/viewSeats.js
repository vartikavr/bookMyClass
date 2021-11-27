import "./viewSeats.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ViewSeats = () => {
  const [endPending, setEndPending] = useState(false);
  const { id: classId } = useParams();
  const [classroom, setClassroom] = useState({});
  const [currentClass, setCurrentClass] = useState({});
  const history = useHistory();

  useEffect(() => {
    getStudentsInfo();
  }, []);

  const getStudentsInfo = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/class/${classId}/seats`, {}, axiosConfig)
      .then((res) => {
        setClassroom(res.data.classroom);
        setCurrentClass(res.data.currentClass);
        setEndPending(true);
      })
      .catch((e) => {
        if (e.response.data.isLoggedIn == false) {
          toast.error("Error occured! User not logged in.");
          history.push("/login");
        } else if (e.response.data.isVerified == false) {
          toast.error("Error occured! Confirm your email id to continue.");
          history.push("/");
        } else if (e.response.data.isClassroomTeacher == false) {
          toast.error(
            "Only the class teacher can view the roster of the students for a class!"
          );
          history.push("/classrooms");
        } else {
          toast.error("An error occured. Try again!");
        }
        setEndPending(true);
      });
  };

  return (
    <div className="viewSeats">
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
            <div className="studentsHeading">
              <h1 style={{ color: "#f88138" }} className="mt-4">
                Students
              </h1>
            </div>
            <hr style={{ color: "black" }} />
            {classroom.students.length > 0 ? (
              <table class="table table-hover">
                <thead style={{ color: "#f88138" }}>
                  <tr>
                    <th scope="col" style={{ width: "10%" }}>
                      #
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
                      Name
                    </th>
                    <th scope="col" style={{ width: "35%" }}>
                      Email
                    </th>
                    <th scope="col" style={{ width: "25%" }}>
                      Attending
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classroom.students.map((student, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      {student.classes.includes(currentClass._id) && (
                        <td>
                          <button className="inPerson" disabled>
                            in-person
                          </button>
                        </td>
                      )}
                      {!student.classes.includes(currentClass._id) && (
                        <td>
                          <button className="remote" disabled>
                            Remotely
                          </button>
                        </td>
                      )}
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

export default ViewSeats;
