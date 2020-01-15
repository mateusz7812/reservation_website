import React from 'react';
import {Switch} from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import PrivateRoute from "./components/route/PrivateRoute";
import PublicRoute from "./components/route/PublicRoute";
import EventPage from "./components/EventPage";
import AdminRoute from "./components/route/AdminRoute";
import AdminPage from "./components/adminPage/AdminPage";
import AddingReservationPage from "./components/AddingReservationPage";
import AddingEventPage from "./components/AddingEventPage";
import AddingAccountPage from "./components/AddingAccountPage";
import AddingReservablePage from "./components/AddingReservablePage";

const App = () => {
  return (
        <Switch>
            <PublicRoute path="/login" component={LoginPage}/>
            <PublicRoute path="/register" component={RegisterPage}/>
            <PrivateRoute path="/adding/reservation" component={AddingReservationPage}/>
            <PrivateRoute path="/adding/event" component={AddingEventPage}/>
            <PrivateRoute path="/adding/account" component={AddingAccountPage}/>
            <PrivateRoute path="/adding/reservable" component={AddingReservablePage}/>
            <PrivateRoute path="/event/:id" component={EventPage}/>
            <AdminRoute path="/admin" component={AdminPage}/>
            <PrivateRoute path="/" component={HomePage}/>
        </Switch>
  )
};
export default App;
