import React from 'react';
import {Switch} from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import EventPage from "./components/EventPage";

const App = () => {
  return (
        <Switch>
          <PublicRoute path="/login" component={LoginPage}/>
          <PublicRoute path="/register" component={RegisterPage}/>
          <PrivateRoute path="/event/:id" component={EventPage}/>
          <PrivateRoute path="/" component={HomePage}/>
        </Switch>
  )
};
export default App;
