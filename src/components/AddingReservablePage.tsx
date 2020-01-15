import AddObjectPage from "./AddingObjectPage";
import React, {FunctionComponent} from "react";
import DataModel from "../dataModels/DataModel";
import ReservableLabel from "./itemView/ReservableLabel";
import {ReservableModel} from "../dataModels/ReservableModel";
import ReservableService from "../services/ReservableService";

const AddingReservablePage: FunctionComponent<{ location: any }>  = ({location}) => {
   let objectsToAdd: [] = location.state?.reservablesToAdd;
   let redirectPath: string | undefined = location.state?.redirectPath;

   let objectView: FunctionComponent<{ object: DataModel, message: string }> = ({object, message}) => {
      return (<div><ReservableLabel reservableModel={object as ReservableModel}/>
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
           createAddObjectPromise={(object: DataModel) => ReservableService.addOne(object as unknown as ReservableModel) as Promise<DataModel | undefined>}
           objectsToAdd={objectsToAdd}
           objectView={objectView}
           redirectPath={redirectPath}
       />
   )
};

export default AddingReservablePage;