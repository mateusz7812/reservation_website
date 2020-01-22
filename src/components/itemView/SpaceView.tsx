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
        padding: 10px;
    `;

    let ReservablesViewsDiv = styled.div`
        float: left;
        width: 100%;
    `;

    let ClearDiv = styled.div`
        clear: both;
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
                            <ReservablesViewsDiv>
                                {
                                    reservablesViews
                                }
                            </ReservablesViewsDiv>
                            <ClearDiv/>
                        </StyledDiv>
                    );
                }
            }
        </DataContext.Consumer>

        )
};

// @ts-ignore
export default SpaceView;