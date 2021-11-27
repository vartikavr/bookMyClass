import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./views/header/header";
import Home from "./views/home/home";
import Login from "./views/user/loginPage/login/login";
import ConfirmEmail from "./views/user/confirmEmail/confirmEmail";
import ResetPassword from "./views/user/resetPassword/resetPassword";
import Classrooms from "./views/classroom/myClassrooms/classrooms";
import NewClassroom from "./views/classroom/newClassroom/newClassroom/newClassroom";
import ShowClassroom from "./views/classroom/showClassroom/showClassroom/showClassroom";
import NewClass from "./views/class/newClass/newClass";
import People from "./views/classroom/showPeople/people";
import ViewSeats from "./views/class/viewSeats/viewSeats";
import Profile from "./views/user/profile/profile/profile";
import MyClasses from "./views/class/myBookings/myClasses/myClasses";
import NotFound from "./views/notFound/notFound";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Header />
          <Home />
        </Route>
        <Route exact path="/login">
          <Header />
          <Login />
        </Route>
        <Route exact path="/confirmation/:token">
          <Header />
          <ConfirmEmail />
        </Route>
        <Route exact path="/reset/:token">
          <Header />
          <ResetPassword />
        </Route>
        <Route exact path="/classrooms">
          <Header />
          <Classrooms />
        </Route>
        <Route exact path="/class">
          <Header />
          <MyClasses />
        </Route>
        <Route exact path="/classrooms/new">
          <Header />
          <NewClassroom />
        </Route>
        <Route exact path="/classrooms/:id">
          <Header />
          <ShowClassroom />
        </Route>
        <Route exact path="/classrooms/:id/new">
          <Header />
          <NewClass />
        </Route>
        <Route exact path="/classrooms/:id/people">
          <Header />
          <People />
        </Route>
        <Route exact path="/class/:id/seats">
          <Header />
          <ViewSeats />
        </Route>
        <Route exact path="/profile">
          <Header />
          <Profile />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
