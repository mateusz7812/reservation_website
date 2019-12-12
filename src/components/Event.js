import React from "react";

const Event = (name, startDate)=>{
    return(
        <div>
            <p>{name}</p>
            <p>{startDate}</p>
        </div>);
};

export default Event;