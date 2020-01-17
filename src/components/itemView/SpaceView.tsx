import React from "react";
import ReservableView from "./ReservableView";
import {SpaceModel} from "../../dataModels/ReservableModel";
import SpaceLabel from "./SpaceLabel";
import styled from "styled-components";
import {DataContext} from "../reservationManager/DataContext";

type func = (reservableId: string)=>void;

const SpaceView =({selected, reserved, spaceId, onClick}:
                      {selected?: boolean, reserved?: boolean, spaceId: string, onClick:func | undefined})=>{
    const StyledDiv = styled.div`
        clear: both;
        border: 1px solid black;
        border-radius: 5px;
        padding: 10px;
    `;

    return(
        <DataContext.Consumer>
            {
                (data)=>{
                    let space = data.allReservables.get(spaceId);
                    let reservablesViews:any=[];
                    // eslint-disable-next-line no-unused-expressions
                    (space as SpaceModel).reservables?.forEach((id: string)=>
                        reservablesViews.push(<ReservableView reserved={reserved} selected={selected} key={id} reservableId={id} onClick={onClick}/>));

                    return(
                        <StyledDiv>
                            <SpaceLabel reserved={reserved} selected={selected} reservableModel={space as SpaceModel} onClick={onClick}/>
                            <div>
                                {
                                    reservablesViews
                                }
                            </div>
                        </StyledDiv>
                    );
                }
            }
        </DataContext.Consumer>

        )
};

// @ts-ignore
export default SpaceView;