import styles from "../../styles/class.module.css";

const ShowClassroom = () => {
  return (
    <div className="showClassroom">
      <div className="col-sm-8 offset-sm-2">
        <div className="containerClassrooms">
          <div className="Classrooms card">
            <div
              className="card-head"
              //   style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="card-title">My Classrooms</div>
              <div className="card-class" style={{ marginLeft: "auto" }}>
                <a href="/">People</a>
              </div>
            </div>
            <div className="title-text">subject</div>
          </div>
        </div>
        <div className="showClassroomBody">
          <div className="body-title">Scheduled Classes</div>
          <button className="btn-addClass">Add Class</button>
          <div className="row">
            <div className="col-lg-6 col-xl-4 d-flex align-items">
              <div class={styles.flipCard}>
                <div class={styles.flipCardInner}>
                  <div class={styles.flipCardFront}>
                    <img
                      src={`${process.env.PUBLIC_URL}/logo192.png`}
                      //   alt="Avatar"
                      //   style="width:300px;height:300px;"
                    />
                  </div>
                  <div class={styles.flipCardBack}>
                    <h1>John Doe</h1>
                    <p>Architect & Engineer</p>
                    <p>We love that guy</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-4 d-flex align-items">
              <div class={styles.flipCard}>
                <div class={styles.flipCardInner}>
                  <div class={styles.flipCardFront}>
                    <img
                      src={`${process.env.PUBLIC_URL}/logo192.png`}
                      //   alt="Avatar"
                      //   style="width:300px;height:300px;"
                    />
                  </div>
                  <div class={styles.flipCardBack}>
                    <h1>John Doe</h1>
                    <p>Architect & Engineer</p>
                    <p>We love that guy</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-4 d-flex align-items">
              <div class={styles.flipCard}>
                <div class={styles.flipCardInner}>
                  <div class={styles.flipCardFront}>
                    <img
                      src={`${process.env.PUBLIC_URL}/logo192.png`}
                      //   alt="Avatar"
                      //   style="width:300px;height:300px;"
                    />
                  </div>
                  <div class={styles.flipCardBack}>
                    <h1>John Doe</h1>
                    <p>Architect & Engineer</p>
                    <p>We love that guy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-xl-4 d-flex align-items">
              <div class={styles.flipCard}>
                <div class={styles.flipCardInner}>
                  <div class={styles.flipCardFront}>
                    <h1>title</h1>
                  </div>
                  <div class={styles.flipCardBack}>
                    <p>Date</p>
                    <p>Time</p>
                    <p>seats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowClassroom;
