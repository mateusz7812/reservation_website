import EventModel from "../../dataModels/EventModel";
import React, {useRef} from "react";
import styled from "styled-components";
import {StyledButtonInput, StyledLabel} from "../StyledComponents";

const AddEventForm = ({callWithNewEvent}: { callWithNewEvent: (_: EventModel) => void }) => {
    let nameRef = useRef(null);
    let startDateRef = useRef(null);
    let startTimeRef = useRef(null);
    let endDateRef = useRef(null);
    let endTimeRef = useRef(null);

    const getCurrentDate = () => {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        return yyyy + '-' + mm + '-' + dd;
    };

    const generateEvent = (): EventModel => {
        const getTime = (dateString: string) => new Date(dateString).getTime() / 1000;

        // @ts-ignore
        let startDateValue = getTime(startDateRef.current?.value + "T" + startTimeRef.current?.value + "Z");
        // @ts-ignore
        let endDateValue = getTime(endDateRef.current?.value + "T" + endTimeRef.current?.value + "Z");

        // @ts-ignore
        const nameValue = nameRef.current?.value;
        return new EventModel({"name": nameValue, "startDate": startDateValue, "endDate": endDateValue});
    };


    const Input = styled.input`
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

    let DivWrapper = styled.div`
            width: 30%;
            margin: 30px auto;
            background-color: white;
            padding: 20px 40px;
            box-shadow: 0 0 5px black;
        `;

    return (
        <DivWrapper>
            <h3>New Event</h3>
            <StyledLabel>
                Name:
                <Input id="nameInput" type="text" ref={nameRef}/>
            </StyledLabel>
            <StyledLabel>
                Start date:
                <Input id="startDateInput" type="date" ref={startDateRef} defaultValue={getCurrentDate()}/>
                <Input id="startTimeInput" type="time" ref={startTimeRef} defaultValue="00:00"/>
            </StyledLabel>
            <StyledLabel>
                End date:
                <Input id="endDateInput" type="date" ref={endDateRef} defaultValue={getCurrentDate()}/>
                <Input id="endTimeInput" type="time" ref={endTimeRef} defaultValue="23:59"/>
            </StyledLabel>
            <StyledDiv>
                <Button id="saveButton" type="button" value="Next"
                   onClick={() => callWithNewEvent(generateEvent())}/>
            </StyledDiv>
        </DivWrapper>
    );

};

export default AddEventForm;