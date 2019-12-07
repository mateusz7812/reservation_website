import React from 'react';
import './App.css';
import {Switch} from 'react-router-dom';
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "../PublicRoute";

const App = () => {
  return (
        <Switch>
          <PublicRoute path="/login" component={LoginPage}/>
          <PublicRoute path="/register" component={RegisterPage}/>
          <PrivateRoute path="/" component={HomePage}/>
        </Switch>
  )
};
export default App;
