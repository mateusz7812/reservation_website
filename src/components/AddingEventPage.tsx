import AddObjectPage from "./AddingObjectPage";
import React, {FunctionComponent} from "react";
import DataModel from "../dataModels/DataModel";
import ReservationService from "../services/ReservationService";
import ReservationModel from "../dataModels/ReservationModel";
import EventService from "../services/EventService";
import ReservableLabel from "./itemView/ReservableLabel";
import {ReservableModel} from "../dataModels/ReservableModel";
import EventModel from "../dataModels/EventModel";
import EventView from "./itemView/EventView";

type objectsDict = { [key: string]: DataModel }

const AddingEventPage: FunctionComponent<{ location: any }>  = ({location}) => {
   let objectsToAdd: [] = location.state?.eventsToAdd;
   let requiredObjects: { [key: string]: {} } = {reservables: location.state?.allReservables};
   let redirectPath: string | undefined = location.state?.redirectPath;

   let objectView: FunctionComponent<{ object: DataModel, requiredData: { [key: string]: objectsDict }, message: string }> = ({object, requiredData, message}) => {
      return (<div><EventView event={object as EventModel}/>
         {
            object.added?.()
                ? "added"
                : message === undefined
                ? "adding"
                : message
         }
      </div>);
   };

   return(
       <AddObjectPage
           createAddObjectPromise={(object: DataModel) => EventService.addOne(object as unknown as EventModel) as Promise<DataModel | undefined>}
           objectsToAdd={objectsToAdd}
           requiredObjects={requiredObjects}
           objectView={objectView}
           redirectPath={redirectPath}
       />
   )
};

export default AddingEventPage;