import React from 'react';
import './App.css';
import {Switch, Route} from 'react-router-dom';
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegisterForm from "../RegisterForm";

const App = () => {
  return (
        <Switch>
          <Route path="/login" component={LoginPage}/>
          <Route path="/register" component={RegisterForm}/>
          <Route path="/" component={HomePage}/>
        </Switch>
  )
};
export default App;
