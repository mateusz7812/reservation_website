import React from "react";
import AccountModel from "../../dataModels/AccountModel";
import styled from "styled-components";

const AccountLabel = ({account, onClick}: {account: AccountModel, onClick?: ()=>void})=>{
   let StyledDiv = styled.div`
        border: 1px solid black;
        margin: 2px;
        padding: 4px 2px;
   `;

    return(
       <StyledDiv onClick={onClick}>
           {account.login} | {account.reservations?.length} reservations { account.isAdmin()? "| admin" : null }
       </StyledDiv>
   );
};

export default AccountLabel