import "./createClassroom.css";

const CreateClassroom = ({
  classname,
  changeClassname,
  section,
  changeSection,
  subject,
  changeSubject,
  handleCreate,
  isCreationPending,
}) => {
  return (
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
              onChange={(event) => changeClassname(event.target.value)}
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
              onChange={(event) => changeSection(event.target.value)}
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
              onChange={(event) => changeSubject(event.target.value)}
            />
          </div>
        </fieldset>
        {!isCreationPending && (
          <button type="submit" class="btn-create">
            Submit
          </button>
        )}
        {isCreationPending && (
          <button type="submit" class="btn-create" disabled>
            <span
              class="spinner-border spinner-border-sm"
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
