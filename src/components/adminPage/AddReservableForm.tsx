import React, {FunctionComponent, useRef} from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";

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

    return(
        <div>
            <label>
                Type:
                <select id={"typeSelect"} ref={typeRef}>
                    <option defaultChecked={true} value={""}>Select type</option>
                    <option value={"Seat"}>Seat</option>
                    <option value={"Space"}>Space</option>
                </select>
            </label>
            <label>
                Name:
                <input type="text" id="nameInput" ref={nameRef}/>
            </label>
            <input type="button" id="saveButton" value="Next" onClick={handleSave}/>
        </div>
    );
};

export default AddReservableForm;