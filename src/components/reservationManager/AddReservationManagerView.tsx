import AccountList from "../AccountList";
import EventList from "../EventList";
import ReservableView from "../itemView/ReservableView";
import SelectedReservablesList from "./SelectedReservablesList";
import React, {FunctionComponent} from "react";
import {DataContext} from "./DataContext";
import DataModel from "../../dataModels/DataModel";
import styled from "styled-components";
import {StyledButtonInput} from "../StyledComponents";

const AddReservationManagerView: FunctionComponent<{accountId: string|undefined, reservableId: string|undefined, eventId: string|undefined,
    setAccountId: (_:string)=> void, setEventId: (_:string)=> void, selectionChanger: (_:string)=> void, makeReservation: ()=> void, }> =
    ({accountId, reservableId, eventId,
         setAccountId, setEventId, selectionChanger, makeReservation}) => {

    const map_to_dict = ( aMap: Map<string, DataModel>) => {
        const obj:{[key: string]: DataModel} = {};
        aMap.forEach ((v,k) => { obj[k] = v });
        return obj;
    };

    const LeftDiv = styled.div`
        float: left;
        width: 68%;
        margin: 30px auto;
        min-height: 400px;
        background-color: white;
        padding: 20px 40px;
        box-shadow: 0 0 5px black;
        box-sizing: border-box;
    `;

    const RightDiv = styled.div`
        float: right;
        width: 30%;
        margin: 30px auto;
        background-color: white;
        padding: 20px 40px;
        box-shadow: 0 0 5px black;
        box-sizing: border-box;
    `;

    const ButtonDiv = styled.div`
        clear: both;
        margin-left: auto;
        margin-right: auto;
        width: fit-content;
    `;

    const ReservationManagerDiv = styled.div`
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    `;

    let DivWrapper = styled.div`
        width: 30%;
        margin: 30px auto;
        background-color: white;
        padding: 20px 40px;
        box-shadow: 0 0 5px black;
    `;

    return (
        <ReservationManagerDiv id="reservationManager">
            <DataContext.Consumer>
            {
                (data)=>{
                    return accountId === undefined
                    ? <DivWrapper>
                            <h3>Select Account</h3>
                            <AccountList
                            // @ts-ignore
                            accounts={map_to_dict(data.loadedAccounts)}
                            callWithId={setAccountId}/>
                    </DivWrapper>
                    : eventId === undefined
                    ? <DivWrapper>
                            <h3>Select Event</h3>
                            <EventList
                                // @ts-ignore
                                events={map_to_dict(data.loadedEvents)}
                                callWithId={setEventId}/>
                    </DivWrapper>
                    :   <>
                            <LeftDiv>
                                <h3>Select Reservables</h3>
                                <hr/>
                                <ReservableView reservableId={reservableId as string} onClick={selectionChanger}/>
                            </LeftDiv>
                            <RightDiv>
                                <h3>Selected</h3>
                                <SelectedReservablesList selectionChanger={selectionChanger}/>
                            </RightDiv>
                            <ButtonDiv>
                                <StyledButtonInput id="reserveButton" type="button" value={"Add reservation"} onClick={makeReservation}/>
                            </ButtonDiv>
                        </>
                }
            }
            </DataContext.Consumer>
        </ReservationManagerDiv>

    );
};

export default AddReservationManagerView;