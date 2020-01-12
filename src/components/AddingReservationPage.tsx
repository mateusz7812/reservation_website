import React, {FunctionComponent} from "react";
import AddingObjectPage from "./AddingObjectPage";
import ReservationModel from "../dataModels/ReservationModel";
import ReservationService from "../services/ReservationService";
import DataModel from "../dataModels/DataModel";
import ReservableLabel from "./itemView/ReservableLabel";
import {ReservableModel} from "../dataModels/ReservableModel";

type objectsDict = { [key: string]: DataModel }

const AddingReservationPage: FunctionComponent<{ location: any }> = ({location}) => {
    let objectsToAdd: [] = location.state?.reservationsToAdd;
    let requiredObjects: { [key: string]: {} } = {reservables: location.state?.allReservables};
    let redirectPath: string | undefined = location.state?.redirectPath;

    let objectView: FunctionComponent<{ object: DataModel, requiredData: { [key: string]: objectsDict }, message: string }> = ({object, requiredData, message}) => {
        return (<div><ReservableLabel
            reservableModel={requiredData["reservables"][(object as unknown as ReservationModel).reservable as string] as ReservableModel}/>
            {
                object.added?.()
                    ? "added"
                    : message === undefined
                    ? "adding"
                    : message
            }
        </div>);
    };

    return (
        <AddingObjectPage
            createAddObjectPromise={(object: DataModel) => ReservationService.addOne(object as unknown as ReservationModel) as Promise<DataModel | undefined>}
            objectsToAdd={objectsToAdd}
            requiredObjects={requiredObjects}
            objectView={objectView}
            redirectPath={redirectPath}
        />
    );
};

export default AddingReservationPage;