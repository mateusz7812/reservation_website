import React from "react";
import AddReservationManager from "../reservationManager/AddReservationManager";

const AdminAddReservationManager = () => {
   return(
       <AddReservationManager redirectPath={"/admin"}/>
   );
};

export default AdminAddReservationManager;