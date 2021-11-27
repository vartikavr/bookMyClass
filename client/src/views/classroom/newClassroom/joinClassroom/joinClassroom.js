import "./joinClassroom.css";

const JoinClassroom = ({ code, changeCode, isJoiningPending, handleJoin }) => {
  return (
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
              onChange={(event) => changeCode(event.target.value)}
            />
          </div>
        </fieldset>
        {!isJoiningPending && (
          <button type="submit" class="btn-join">
            Join
          </button>
        )}
        {isJoiningPending && (
          <button type="submit" class="btn-join" disabled>
            <span
              class="spinner-border spinner-border-sm"
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
