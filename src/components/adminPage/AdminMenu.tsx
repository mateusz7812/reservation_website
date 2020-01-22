import React from "react";
import styled from "styled-components";
import {StyledButtonInput} from "../StyledComponents";
import {MenuDiv} from "./AdminPage";

const AdminMenu = ({redirectTo}: {redirectTo: (path: string)=>void})=>{

    let StyledMenuButton = styled(StyledButtonInput)`
        width: 100%;
        float: left;
    `;

   return(
       <MenuDiv>
            <StyledMenuButton type="button" value="Events" id="eventsButton" onClick={()=>redirectTo("/admin/event")}/>
            <StyledMenuButton type="button" value="Accounts" id="accountsButton" onClick={()=>redirectTo("/admin/account")}/>
            <StyledMenuButton type="button" value="Reservables" id="reservablesButton" onClick={()=>redirectTo("/admin/reservable")}/>
            <StyledMenuButton type="button" value="Reservations" id="reservationsButton" onClick={()=>redirectTo("/admin/reservation")}/>
            <StyledMenuButton type={"button"} value={"Log out"} onClick={()=>redirectTo("/logout")}/>
       </MenuDiv>
   );
};

export default AdminMenu;