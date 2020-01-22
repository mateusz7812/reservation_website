import React, {FunctionComponent, useRef} from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";
import {StyledButtonInput, StyledLabel} from "../StyledComponents";
import styled from "styled-components";

const AddReservableForm: FunctionComponent<{callWithNewReservable: (_:ReservableModel)=>void}> = ({callWithNewReservable})=>{

    let nameRef = useRef(null);
    let typeRef = useRef(null);

    const handleSave = () => {
        // @ts-ignore
        const type = typeRef.current.value;
        if(type === undefined) return;
        let reservable = ReservableModel.new({"type": type});
        if (reservable === undefined) return;

        // @ts-ignore
        reservable.name = nameRef.current?.value;
       callWithNewReservable(reservable);
    };

    let Input = styled.input`
        float: right;
    `;

    let DivWrapper = styled.div`
            width: 30%;
            margin: 30px auto;
            background-color: white;
            padding: 20px 40px;
            box-shadow: 0 0 5px black;
        `;

    const StyledSelect = styled.select`
        display: block;
        float: right;
    `;

    const StyledDiv = styled.div`
        margin: 20px 0;
        clear: both;
        width: 100%;
        text-align:center;
    `;

    const Button = styled(StyledButtonInput)`
        margin: 10px auto;
    `;

    const StyledOption = styled.option`
        width: 120px;
    `;

    return(
        <DivWrapper>
            <h3>New Reservable</h3>
            <StyledLabel>
                Type:
                <StyledSelect id={"typeSelect"} ref={typeRef}>
                    <StyledOption defaultChecked={true} value={""}>Select type</StyledOption>
                    <StyledOption value={"Seat"}>Seat</StyledOption>
                    <StyledOption value={"Space"}>Space</StyledOption>
                </StyledSelect>
            </StyledLabel>
            <StyledLabel>
                Name:
                <Input type="text" id="nameInput" ref={nameRef}/>
            </StyledLabel>
            <StyledDiv>
                <Button type="button" id="saveButton" value="Next" onClick={handleSave}/>
            </StyledDiv>
        </DivWrapper>
    );
};

export default AddReservableForm;