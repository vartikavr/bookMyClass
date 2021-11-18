import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./header";
import Home from "./home";
import Login from "./views/user/login";
import ConfirmEmail from "./views/user/confirmEmail";
import Classrooms from "./views/classes/classrooms";
import NewClassroom from "./views/classes/newClassroom";
import ShowClassroom from "./views/classes/showClassroom";

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
      </Switch>
    </Router>
  );
}

export default App;
