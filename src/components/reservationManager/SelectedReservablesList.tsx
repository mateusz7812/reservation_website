import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableLabel from "../itemView/ReservableLabel";
import styled from "styled-components";
import {DataContext} from "./DataContext";

const SelectedReservablesList = ({
                                     //selectedReservablesIds, allReservables,
                                     selectionChanger}:
                                     {
                                         //selectedReservablesIds: string[], allReservables: {[id: string]:ReservableModel},
                                         selectionChanger: (reservableId: string)=>void})=>{
    let SelectedReservablesDiv = styled.div`
        min-height: 300px;
    `;

    return(
        <SelectedReservablesDiv id="selectedReservablesList">
                <DataContext.Consumer>
                    {
                        (data)=><div>
                            {
                                data.selectedReservablesIds.map((reservableId)=>
                                    <ReservableLabel key={reservableId+"selection"} onClick={selectionChanger} reservableModel={data.allReservables.get(reservableId) as ReservableModel}/>
                                )
                            }
                        </div>
                    }
                </DataContext.Consumer>
        </SelectedReservablesDiv>
    )
};

// @ts-ignore
export default SelectedReservablesList