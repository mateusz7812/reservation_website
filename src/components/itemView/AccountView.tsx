import React from "react";
import AccountModel from "../../dataModels/AccountModel";

const AccountView = ({account, onClick}: {account: AccountModel, onClick: ()=>void})=>{
   return(
       <div onClick={onClick}>
           <p>{account.login}</p>
       </div>
   );
};

export default AccountView