import React from "react";




function Header(props) {
    return (
        <div >
            <h1><span className = "green">{props.header}</span></h1>
        
        </div>
    )
}

function PriorityHeader() {
    function getDate() {
        return new Date().toDateString();
    }

    return (
    <div>
         <h1><span className = "green">Quote of The Day</span></h1>
        <p>{getDate()}</p>
    </div>
    )
}

export {PriorityHeader, Header}