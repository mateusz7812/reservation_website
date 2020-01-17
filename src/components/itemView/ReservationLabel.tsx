import React, {FunctionComponent} from "react";
import ReservationModel from "../../dataModels/ReservationModel";
import AccountModel from "../../dataModels/AccountModel";
import EventModel from "../../dataModels/EventModel";
import {ReservableModel} from "../../dataModels/ReservableModel";
import styled from "styled-components";

const ReservationLabel: FunctionComponent<{
        reservation: ReservationModel, account: AccountModel | undefined, event: EventModel | undefined, reservable: ReservableModel | undefined, onClick?: ()=> void
    }> = ({reservation, account, event, reservable, onClick}) =>{

    const StyledDiv = styled.div`
        bos-sizing: border-box;
        border: 1px solid black;
        margin: 2px 4px;
        padding: 3px
    `;

    return(
        <StyledDiv onClick={onClick}>
            {reservation.id}  {account?.login} {event?.name} {reservable?.name}
        </StyledDiv>
    );
};

export default ReservationLabel;