import React, {useState} from "react";





function PriorityLists(props) {
    const [isChecked, setChecked] = useState(false);
    const [changeInput, setChangeInput] = useState(props.text_value);



    function check(e) {
        const id_to_be_deleted = e.target.attributes.getNamedItem("unique_Key").value;
       
        if(!isChecked) {
            setChecked(true);
            props.addIds(isChecked, id_to_be_deleted);

        }

        else {
            setChecked(false);
            props.addIds(isChecked, id_to_be_deleted)
        }
    }

    function setChange(e) {
        setChangeInput(e.target.value);
        props.local_storage(e);
    }

    

    return ( 
    <form key = {props.id}  >
       <div className = "input-group mb-3">
            <div className="input-group-prepend">
                <div className="input-group-text">
                <input unique_Key = {props.id}   onInput = {e=>   e.target.checked = isChecked} onClick={e=> check(e) } checked = {props.checked} id = "check-item" type="checkbox" aria-label="Checkbox for following text input"/>
                </div>
            </div>
            <textarea id = {props.id} onChange = {e=>setChange(e)} value = {changeInput}   class="form-control"  rows="1" name = {props.name}></textarea>
            
         </div>
   </form>
    )
}

export {PriorityLists};

