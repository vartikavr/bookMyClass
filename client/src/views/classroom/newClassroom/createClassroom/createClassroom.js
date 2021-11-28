import "./createClassroom.css";

const CreateClassroom = ({
  //get and set(change) the following values in the form
  classname,
  changeClassname,
  section,
  changeSection,
  subject,
  changeSubject,
  //handle creation of a classroom in the backend
  handleCreate,
  //is creation of classroom in-process or not
  isCreationPending,
}) => {
  return (
    <div className="form-wrapper is-active">
      <button type="button" className="switcher switcher-create">
        Create Classroom
        <span className="underline"></span>
      </button>
      <form onSubmit={handleCreate} className="formClassroom form-create">
        <fieldset>
          <p className="info-classroom">
            Enter details to generate a classroom as its teacher
          </p>
          <div className="input-block">
            <input
              id="class"
              type="text"
              name="class"
              placeholder="Class"
              required
              autoFocus
              value={classname}
              onChange={(event) => changeClassname(event.target.value)}
            />
          </div>
          <div className="input-block notFirst">
            <input
              id="section"
              type="text"
              name="section"
              placeholder="Section"
              required
              value={section}
              onChange={(event) => changeSection(event.target.value)}
            />
          </div>
          <div className="input-block notFirst">
            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={subject}
              onChange={(event) => changeSubject(event.target.value)}
            />
          </div>
        </fieldset>
        {!isCreationPending && (
          <button type="submit" className="btn-create">
            Submit
          </button>
        )}
        {isCreationPending && (
          <button type="submit" className="btn-create" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp; Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateClassroom;
