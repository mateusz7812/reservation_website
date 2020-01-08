import React from "react";
import AccountModel from "../dataModels/AccountModel";
import AccountView from "./itemView/AccountView";

const AccountList = ({accounts, callWithId}:{accounts: {[key: string]:AccountModel}, callWithId:(_:string)=>void})=>{
   return(
       <div>
           {
               Object.keys(accounts).map((accountId: string)=><AccountView key={"account_"+accountId+"_View"} account={accounts[accountId]} onClick={()=>callWithId(accountId)}/>)
           }
       </div>
   )
};

export default AccountList;