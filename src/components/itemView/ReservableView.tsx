import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";
import SeatView from "./SeatView";
import SpaceView from "./SpaceView";
import {DataContext} from "../reservationManager/DataContext";

type func = (reservableId: string)=>void;

const ReservableView = ({selected, reserved, reservableId, onClick}:
                            {selected?: boolean, reserved?: boolean, reservableId: string, onClick: func | undefined})=>{

    return (
        <DataContext.Consumer>
            {(data)=>{
                let reservable: ReservableModel|undefined = data.allReservables.get(reservableId as string);
                    const isReserved = reserved === undefined ? data.reservedReservablesIds.includes(reservable?.id as string) : reserved;
                    const isSelected = selected === undefined ? data.selectedReservablesIds.includes(reservable?.id as string) : selected;

                    return reservable?.type === "Seat"
                        ? <SeatView reserved={isReserved} selected={isSelected} seatId={reservableId} onClick={onClick}/>
                        : reservable?.type === "Space"
                        ? <SpaceView reserved={isReserved} selected={isSelected} spaceId={reservableId} onClick={onClick}/>
                        : <div>loading</div>
            }
            }
        </DataContext.Consumer>);
};

export default ReservableView;