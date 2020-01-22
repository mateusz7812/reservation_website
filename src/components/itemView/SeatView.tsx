import React from "react";
import styled from "styled-components";
import {DataContext} from "../reservationManager/DataContext";
import {SeatModel} from "../../dataModels/ReservableModel";

type func = (reservableId: string)=>void;

const SeatView = ({selected, reserved, seatId, onClick}:
                      {selected?: boolean, reserved?: boolean, seatId: string, onClick:func | undefined})=>{

    const StyledDiv = styled.div`
        clear: both;
        height: 20px;
        width: fit-content;
        border: 1px solid black;
        padding: 3px;
    `;

    let ExtendedDiv = styled(StyledDiv)`
        ${reserved 
        ? "background-color: lightgrey;"
        : (
            selected 
                ? "box-shadow: 0 0 2px 2px black;"
                : undefined
        )}
    `;

    return(
        <DataContext.Consumer>
            {
                (data)=>{
                    let seat = data.allReservables.get(seatId) as SeatModel;
                    return(
                        <ExtendedDiv className="seatView" onClick={()=>onClick?.(seatId)}>
                            {
                                seat.name
                            }
                        </ExtendedDiv>
                    );
                }
            }
        </DataContext.Consumer>
    );
};

export default SeatView;