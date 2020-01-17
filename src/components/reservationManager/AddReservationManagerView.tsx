import AccountList from "../AccountList";
import EventList from "../EventList";
import ReservableView from "../itemView/ReservableView";
import SelectedReservablesList from "./SelectedReservablesList";
import React, {FunctionComponent} from "react";
import {DataContext} from "./DataContext";
import DataModel from "../../dataModels/DataModel";

const AddReservationManagerView: FunctionComponent<{accountId: string|undefined, reservableId: string|undefined, eventId: string|undefined,
    setAccountId: (_:string)=> void, setEventId: (_:string)=> void, selectionChanger: (_:string)=> void, makeReservation: ()=> void, }> =
    ({accountId, reservableId, eventId,
         setAccountId, setEventId, selectionChanger, makeReservation}) => {

    const map_to_dict = ( aMap: Map<string, DataModel>) => {
        const obj:{[key: string]: DataModel} = {};
        aMap.forEach ((v,k) => { obj[k] = v });
        return obj;
    };

    return (
        <div id="reservationManager">
            <DataContext.Consumer>
            {
                (data)=>{
                    return accountId === undefined
                    ? <AccountList
                            // @ts-ignore
                            accounts={map_to_dict(data.loadedAccounts)}
                            callWithId={setAccountId}/>
                    : eventId === undefined
                    ? <EventList
                            // @ts-ignore
                            events={map_to_dict(data.loadedEvents)}
                            callWithId={setEventId}/>
                    :   <>
                            <ReservableView reservableId={reservableId as string} onClick={selectionChanger}/>
                            <SelectedReservablesList selectionChanger={selectionChanger}/>
                            <input id="reserveButton" type="button" onClick={makeReservation}/>
                        </>
                }
            }
            </DataContext.Consumer>
        </div>

    );
};

export default AddReservationManagerView;