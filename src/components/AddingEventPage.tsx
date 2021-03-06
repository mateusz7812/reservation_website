import AddObjectPage from "./AddingObjectPage";
import React, {FunctionComponent} from "react";
import DataModel from "../dataModels/DataModel";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";
import EventLabel from "./itemView/EventLabel";

const AddingEventPage: FunctionComponent<{ location: any }>  = ({location}) => {
   let objectsToAdd: [] = location.state?.eventsToAdd;
   let requiredObjects: { [key: string]: {} } = {reservables: location.state?.allReservables};
   let redirectPath: string | undefined = location.state?.redirectPath;

   let objectView: FunctionComponent<{ object: DataModel, message: string }> = ({object, message}) => {
      return (<div><EventLabel event={object as EventModel}/>
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