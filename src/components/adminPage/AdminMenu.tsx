import React from "react";
import styled from "styled-components";
import {StyledInput} from "../StyledComponents";
import { MenuDiv } from "./AdminPage";

const AdminMenu = ({redirectTo}: {redirectTo: (path: string)=>void})=>{

    let StyledMenuButton = styled(StyledInput)`
        width: 100%;
        float: left;
    `;

   return(
       <MenuDiv>
            <StyledMenuButton type="button" value="Events" id="eventsButton" onClick={()=>redirectTo("/admin/event")}/>
            <StyledMenuButton type="button" value="Accounts" id="accountsButton" onClick={()=>redirectTo("/admin/account")}/>
            <StyledMenuButton type="button" value="Reservables" id="reservablesButton" onClick={()=>redirectTo("/admin/reservable")}/>
            <StyledMenuButton type="button" value="Reservations" id="reservationsButton" onClick={()=>redirectTo("/admin/reservation")}/>
       </MenuDiv>
   );
};

export default AdminMenu;