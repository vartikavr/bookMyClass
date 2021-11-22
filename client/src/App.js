import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./header";
import Home from "./home";
import Login from "./views/user/login";
import ConfirmEmail from "./views/user/confirmEmail";
import ResetPassword from "./views/user/resetPassword";
import Classrooms from "./views/classroom/classrooms";
import NewClassroom from "./views/classroom/newClassroom";
import ShowClassroom from "./views/classroom/showClassroom";
import NewClass from "./views/class/newClass";
import People from "./views/classroom/people";

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
      </Switch>
    </Router>
  );
}

export default App;
