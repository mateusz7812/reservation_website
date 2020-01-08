import React from "react";
import ReservationModel from "../../dataModels/ReservationModel";
import AccountModel from "../../dataModels/AccountModel";
import EventModel from "../../dataModels/EventModel";
import {ReservableModel} from "../../dataModels/ReservableModel";
import styled from "styled-components";

const ReservationLabel = ({reservation, account, event, reservable}:
                              {reservation: ReservationModel, account: AccountModel | undefined, event: EventModel | undefined, reservable: ReservableModel | undefined}) =>{

    const StyledDiv = styled.div`
        bos-sizing: border-box;
        border: 1px solid black;
        width: 96%;
        margin: 2%;
    `;

    return(
        <StyledDiv>
            {reservation.id}  {account?.login} {event?.name} {reservable?.name}
        </StyledDiv>
    );
};

export default ReservationLabel;