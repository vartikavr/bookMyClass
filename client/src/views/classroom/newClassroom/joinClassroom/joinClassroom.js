import "./joinClassroom.css";

const JoinClassroom = ({ code, changeCode, isJoiningPending, handleJoin }) => {
  return (
    <div className="form-wrapper">
      <button type="button" className="switcher switcher-join">
        Join Classroom
        <span className="underline"></span>
      </button>
      <form className="formClassroom form-join" onSubmit={handleJoin}>
        <fieldset>
          <div className="input-block">
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
              onChange={(event) => changeCode(event.target.value)}
            />
          </div>
        </fieldset>
        {!isJoiningPending && (
          <button type="submit" className="btn-join">
            Join
          </button>
        )}
        {isJoiningPending && (
          <button type="submit" className="btn-join" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp; Join
          </button>
        )}
      </form>
    </div>
  );
};

export default JoinClassroom;
