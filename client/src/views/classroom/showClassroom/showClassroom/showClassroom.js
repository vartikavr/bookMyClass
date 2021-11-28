import "./showClassroom.css";
import CodeModal from "./codeModal";
import EditClassroomModal from "./editClassroomModal";
import ClassroomHeader from "../classroomHeader/classroomHeader";
import ClassTile from "../classTile/classTile";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// loader while page information is being fetched from backend
import ReactLoading from "react-loading";
// show flash success ,error, or info messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ShowClassroom = () => {
  //get classroom id from url
  const { id: classroomId } = useParams();
  //get and set classroom info
  const [classroom, setClassroom] = useState([]);
  //get and set classname, subject, section values in editing form
  const [classname, setClassname] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  //check whether page information has been fetched from backend or not
  const [endPending, setEndPending] = useState(false);
  //get and set the current user info
  const [currentUser, setCurrentUser] = useState("");
  //check if a class is booked or not
  const [isBooked, setIsBooked] = useState(false);
  //check if a class is deleted or not
  const [isClassDeleted, setIsClassDeleted] = useState(false);
  //check if a class is edited (or updated) or not
  const [isEdited, setIsEdited] = useState(false);
  //check if a classroom is deleted or not
  const [isClassroomDeleted, setIsClassroomDeleted] = useState(false);
  //check whether the corresponding action is in-process or not
  const [isPendingBtn, setIsPendingBtn] = useState(false);
  const history = useHistory();
  const date = new Date();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var dateToday = date.getDate();
  if (dateToday < 10) {
    dateToday = "0" + dateToday;
  }
  //get current date
  const currentDate = date.getFullYear() + "-" + month + "-" + dateToday;

  useEffect(() => {
    getClassroomInfo();
    // eslint-disable-next-line
  }, [isBooked, isClassDeleted, isEdited]);

  //get classroom info from backend
  const getClassroomInfo = () => {
    setEndPending(false);
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/classrooms/${classroomId}`, {}, axiosConfig)
      .then((res) => {
        setClassroom(res.data.currentClassroom);
        setClassname(res.data.currentClassroom.classname);
        setSection(res.data.currentClassroom.section);
        setSubject(res.data.currentClassroom.subject);
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

  //show or hide the dropdown list
  const openDropdown = () => {
    let menuContent = document.querySelector(".menu-content");
    if (menuContent.style.display === "") {
      menuContent.style.display = "block";
    } else {
      menuContent.style.display = "";
    }
  };

  //redirect to "Add class" page
  const redirectToAddClass = () => {
    history.push(`/classrooms/${classroomId}/new`);
  };

  //redirect to "people" page
  const redirectToPeople = () => {
    history.push(`/classrooms/${classroomId}/people`);
  };

  return (
    <div className="showClassroom mb-4">
      <CodeModal classroom={classroom} />
      <EditClassroomModal
        classname={classname}
        changeClassname={setClassname}
        section={section}
        changeSection={setSection}
        subject={subject}
        changeSubject={setSubject}
        isClassroomModified={setIsEdited}
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
          <div className="containerClassrooms">
            <ClassroomHeader
              classroom={classroom}
              currentUser={currentUser}
              openDropdown={openDropdown}
              redirectToPeople={redirectToPeople}
              isDeleting={isClassroomDeleted}
              isDeletionPending={setIsClassroomDeleted}
            />
            <div className="showClassroomBody">
              {/* check if current user is classroom's teacher or not */}
              {currentUser._id === classroom.teacher && (
                <div className="classroom-btn">
                  <button className="btn-addClass" onClick={redirectToAddClass}>
                    Add Class
                  </button>
                </div>
              )}
              <div className="row">
                {classroom.classes.length > 0 ? (
                  classroom.classes.map((currentClass) => (
                    <ClassTile
                      currentClass={currentClass}
                      currentUser={currentUser}
                      currentDate={currentDate}
                      classroom={classroom}
                      isProcessPending={isPendingBtn}
                      isProcessGoingOn={setIsPendingBtn}
                      isClassDeleted={setIsClassDeleted}
                      isSeatBooked={setIsBooked}
                    />
                  ))
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
                    No classes to show.
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowClassroom;
