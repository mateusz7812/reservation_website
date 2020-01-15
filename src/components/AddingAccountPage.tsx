import AddObjectPage from "./AddingObjectPage";
import React, {FunctionComponent} from "react";
import DataModel from "../dataModels/DataModel";
import AccountLabel from "./itemView/AccountLabel";
import AccountModel from "../dataModels/AccountModel";
import AccountService from "../services/AccountService";

const AddingAccountPage: FunctionComponent<{ location: any }>  = ({location}) => {
   let objectsToAdd: [] = location.state?.accountsToAdd;
   let redirectPath: string | undefined = location.state?.redirectPath;

   let objectView: FunctionComponent<{ object: DataModel, message: string }> = ({object, message}) => {
      return (<div><AccountLabel account={object as AccountModel}/>
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
           createAddObjectPromise={(object: DataModel) => AccountService.addOne(object as unknown as AccountModel) as Promise<DataModel | undefined>}
           objectsToAdd={objectsToAdd}
           objectView={objectView}
           redirectPath={redirectPath}
       />
   )
};

export default AddingAccountPage;