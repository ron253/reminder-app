import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSyncAlt, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'


function Delete(props) {

    function switchNow() {
        if(!props.filter) {
            props.setFilterItems(true);
            
        }
        else {
            props.setFilterItems(false);
        }
    }


    return <button className = "float-right app-btns ">
        <FontAwesomeIcon onClick = {switchNow} icon = {faTrash} size = "2x" />
    </button>
}

function Refresh(props) {

    return <button className = "app-btns" onClick = {()=> {props.setRefresh(!props.refresh)}} name= "refresh">
        <FontAwesomeIcon icon = {faSyncAlt} size = "2x" />
    </button>
}

function Add(props) {
   
    return <button className = "float-right app-btns " onClick = {()=> props.addToDos()}  name = "add">
        <FontAwesomeIcon icon = {faPlus} size = "2x" />
    </button>
}



export {Delete, Refresh, Add};