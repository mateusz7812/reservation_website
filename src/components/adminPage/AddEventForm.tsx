import EventModel from "../../dataModels/EventModel";
import React, {useRef} from "react";

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

    return (
        <div>
            <label>
                Name:
                <input id="nameInput" type="text" ref={nameRef}/>
            </label>
            <label>
                Start date:
                <input id="startDateInput" type="date" ref={startDateRef} defaultValue={getCurrentDate()}/>
                <input id="startTimeInput" type="time" ref={startTimeRef} defaultValue="00:00"/>
            </label>
            <label>
                End date:
                <input id="endDateInput" type="date" ref={endDateRef} defaultValue={getCurrentDate()}/>
                <input id="endTimeInput" type="time" ref={endTimeRef} defaultValue="23:59"/>
            </label>
            <input id="saveButton" type="button" value="Next"
                   onClick={() => callWithNewEvent(generateEvent())}/>
        </div>
    );

};

export default AddEventForm;