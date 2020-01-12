import EventModel from "../../dataModels/EventModel";
import React, {useState} from "react";

const AddEventForm = ({callWithNewEvent}: { callWithNewEvent: (_: EventModel) => void }) => {
    let [name, setName] = useState("");
    let [startDate, setStartDate] = useState("");
    let [startTime, setStartTime] = useState("");
    let [endDate, setEndDate] = useState("");
    let [endTime, setEndTime] = useState("");

    const generateEvent = (): EventModel => {
        const getTime = (dateString: string) => new Date(dateString).getTime();

        let startDateValue = getTime(startDate + "T" + startTime + "Z");
        let endDateValue = getTime(endDate + "T" + endTime + "Z");
        return new EventModel({"name": name, "startDate": startDateValue, "endDate": endDateValue});
    };

    return (
        <div>
            <label>
                Name:
                <input id="nameInput" type="text" onChange={(event) => setName(event.target.value)}/>
            </label>
            <label>
                Start date:
                <input id="startDateInput" type="date" onChange={(event) => setStartDate(event.target.value)}/>
                <input id="startTimeInput" type="time" onChange={(event) => setStartTime(event.target.value)} value="00:00"/>
            </label>
            <label>
                End date:
                <input id="endDateInput" type="date" onChange={(event) => setEndDate(event.target.value)}/>
                <input id="endTimeInput" type="time" onChange={(event) => setEndTime(event.target.value)} value="23:59"/>
            </label>
            <input id="saveButton" type="button" value="Next"
                   onClick={() => callWithNewEvent(generateEvent())}/>
        </div>
    );

};

export default AddEventForm;