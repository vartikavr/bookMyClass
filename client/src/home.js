import styles from "./styles/home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* ======= Top Section =======  */}
      <section
        id="hero"
        className="d-flex align-items-center section-home mt-0"
      >
        <div className="container mt-5 mb-4">
          <div className="row gy-4">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1 className={styles.h1}>
                Prioritizing learning with BookMyClass!
              </h1>
              <h2 className={styles.h2}>
                We ease your task of scheduling your everyday classes so that
                you experience no hurdles while learning.
              </h2>
              <div>
                <a href="#about" className="a-home btn-get-started scrollto">
                  Get Started
                </a>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img">
              <img
                src={`${process.env.PUBLIC_URL}/hero-img.svg`}
                className="img-fluid animated"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
      {/* End Main Section  */}
      <main id="main">
        {/* ======= About Section =======  */}
        <section id="about" className={styles.about}>
          <div className="container">
            <div className="row justify-content-between">
              <div className="mt-5 mb-5 col-lg-5 d-flex align-items-center justify-content-center about-img">
                <img
                  src={`${process.env.PUBLIC_URL}/about-img.svg`}
                  className="img-fluid"
                  alt=""
                  data-aos="zoom-in"
                />
              </div>
              <div className="col-lg-6 mt-5 pt-lg-0">
                <h3 data-aos="fade-up" className={styles.h3}>
                  Learning amidst pandemic
                </h3>
                <p data-aos="fade-up" data-aos-delay="100" className="mt-4">
                  As per government guidelines, according to the capacity of a
                  particular classroom, certain number of students can now
                  attend in-person classes also instead of just attending them
                  remotely.
                </p>
                <div className="row">
                  <div
                    className="col-md-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <i className="bx bx-book"></i>
                    <h4 className={styles.h4}>In-person classes</h4>
                    <p>
                      Students of a pre-decided number will be allowed to have
                      face-to-face classes.
                    </p>
                  </div>
                  <div
                    className="col-md-6"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <i class="bx bx-laptop"></i>
                    <h4 className={styles.h4}>Remote classes</h4>
                    <p>
                      Students can also continue with their remotely accessed
                      online classes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* End About Section */}
      {/* ======= Services provided Section =======  */}
      <section id="services" className="section-home services section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2 className={styles.h2}>Services</h2>
            <p>Check out the different functionalities of BookMyClass</p>
          </div>
          <div className="row">
            <div
              class="col-md-6 col-lg-3 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div class="icon-box">
                <div class="icon">
                  <i class="bx bx-checkbox-checked"></i>
                </div>
                <h4 class={styles.h4} style={{ color: "#eb5d1e" }}>
                  Create classrooms
                </h4>
                <p class="description">
                  Create classrooms of your own as their teacher and invite
                  related students in them.
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div className="icon-box">
                <div className="icon">
                  <i class="bx bx-file"></i>
                </div>
                <h4 className={styles.h4} style={{ color: "#eb5d1e" }}>
                  Join classrooms
                </h4>
                <p className="description">
                  Join classrooms for different courses in order to get updates
                  about their scheduled classes.
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div className="icon-box">
                <div className="icon">
                  <i class="bx bx-stats"></i>
                </div>
                <h4 className={styles.h4} style={{ color: "#eb5d1e" }}>
                  View available seats
                </h4>
                <p className="description">
                  View all the current available seats for a particular
                  in-person scheduled class.
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="icon-box">
                <div className="icon">
                  <i class="bx bxs-face"></i>
                </div>
                <h4 className={styles.h4} style={{ color: "#eb5d1e" }}>
                  Book your seat
                </h4>
                <p className="description">
                  Book a seat for yourself from the given available seats for a
                  particular class.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* -- End Services Section -- */}

      {/* ======= F.A.Q Section =======  */}
      <section id="faq" className="faq">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2 className={styles.h2}>F.A.Q</h2>
            <p>Frequently Asked Questions</p>
          </div>
          <ul className="faqList" data-aos="fade-up" data-aos-delay="100">
            <li>
              <div
                data-bs-toggle="collapse"
                className="collapsed question"
                href="#faq1"
              >
                Where can I view my scheduled classes?{" "}
                <i class="bi bi-chevron-down icon-show"></i>
                <i class="bi bi-chevron-up icon-close"></i>
              </div>
              <div id="faq1" className="collapse" data-bs-parent=".faq-list">
                <p>
                  All the scheduled classes for your course of a particular
                  classroom can be viewed on{" "}
                  <Link to="/classrooms">My Classrooms</Link>. You need to{" "}
                  <Link to="/login">signUp/signIn</Link> prior to that.
                </p>
              </div>
            </li>
            <li>
              <div
                data-bs-toggle="collapse"
                href="#faq2"
                className="collapsed question"
              >
                I can't attend the in-person classes as of now, can I still
                attend them remotely?
                <i class="bi bi-chevron-down icon-show"></i>
                <i class="bi bi-chevron-up icon-close"></i>
              </div>
              <div id="faq2" className="collapse" data-bs-parent=".faq-list">
                <p>
                  Yes. As per government guidelines, it is not at all compulsory
                  to attend the in-person classes as of now. Only a selected
                  number of students can attend them, following proper social
                  distancing and other listed rules.
                </p>
              </div>
            </li>
            <li>
              <div
                data-bs-toggle="collapse"
                href="#faq3"
                className="collapsed question"
              >
                I'm not fully vaccinated, can I attend the in-person classes?
                <i class="bi bi-chevron-down icon-show"></i>
                <i class="bi bi-chevron-up icon-close"></i>
              </div>
              <div id="faq3" className="collapse" data-bs-parent=".faq-list">
                <p>
                  If you're under 18 age, yes. But otherwise, sorry, but as per
                  government guidelines, a student should be fully vaccinated to
                  attend the in-person classes for the safety of all. Since 18+
                  age vaccines have been provided for quite a long time now,
                  therefore it is expected from the student to be fully
                  vaccinated in order to attend the in-person class.
                </p>
              </div>
            </li>
            <li>
              <div
                data-bs-toggle="collapse"
                href="#faq4"
                className="collapsed question"
              >
                How many total number of seats are available to book from for an
                in-person class?<i class="bi bi-chevron-down icon-show"></i>
                <i class="bi bi-chevron-up icon-close"></i>
              </div>
              <div id="faq4" className="collapse" data-bs-parent=".faq-list">
                <p>
                  As of now, for a batch of 100 students, 25 seats are arranged
                  for in-person attendance in that class.
                </p>
              </div>
            </li>
            <li>
              <div
                data-bs-toggle="collapse"
                href="#faq5"
                className="collapsed question"
              >
                I have a sudden emergency and want to cancel my booking for the
                in-person class seat. Can that be done?
                <i class="bi bi-chevron-down icon-show"></i>
                <i class="bi bi-chevron-up icon-close"></i>
              </div>
              <div id="faq5" className="collapse" data-bs-parent=".faq-list">
                <p>
                  Yes. In case of emergency, the student can cancel their
                  upcoming booking on <Link to="/class">My Bookings</Link>.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      {/* -- End F.A.Q Section -- */}
      <div className="footer section-bg">
        <br />
        <div className="section-title">
          <h2 className="mb-4">Prioritizing learning everyday!</h2>
          &copy; Copyright{" "}
          <strong>
            <span>BookMyClass</span>
          </strong>
        </div>
      </div>
      {/* ======= Footer =======  */}

      {/* End Footer */}
      <a
        href="#"
        className="backToTop active d-flex align-items-center justify-content-center"
      >
        <i class="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
};

export default Home;
