import React, {useState, useEffect} from "react";
import {Delete, Refresh, Add} from "../components/Actions";
import {Header} from "../components/Header";
import {PriorityLists} from "../components/PriorityLists";
import {v4 as uuidv4} from 'uuid';
import { serialize} from "react-serialize";
import PriorityContext from "../components/PriorityContext";
import jwt_decode from "jwt-decode"
 
function Task() {
   

  
    const [toDo, setToDo] = useState([])
    const [idsToRefresh, setIdsToRefresh] = useState([]);
    const [filter_items, setFilterItems] = useState(false);
    const [ids, setIds] = useState([]);
    const {token} = React.useContext(PriorityContext);
    const decodedPublicId = jwt_decode(token)['public_id'];
    const [refresh, setRefresh] = useState(false)

    useEffect(()=> {
        
        let arr = [];
        for(let i=0; i < localStorage.length; i++) {
            let getKey = localStorage.key(i);
            let value = JSON.parse(localStorage.getItem(getKey));
            if(value.unique_key == "toDoList" && value.public_id == decodedPublicId) 
                arr.push({_Id: getKey, item_value: <PriorityLists id = {getKey} checked = {false} addIds = {addIds} local_storage ={ls} text_value = {value.value}  />}); 
        }

    
        setToDo(toDo.concat([...arr, toDo]));
        
    }, [])
    

 



    
    useEffect(() => {
        if(toDo[0] !== undefined) {

            if(filter_items) {
                setToDo(toDo.filter(item=> {
                    return !ids.includes(item._Id);
                }))
                ids.forEach(item=> {
                    localStorage.removeItem(item);
                })
            }

            if(refresh) {
                setToDo(toDo.filter(item=> {
                    return !idsToRefresh.includes(item._Id);
                }))
        
                for(let i=0; i < localStorage.length; i++) {
                    let getKey = localStorage.key(i);
                    let value = JSON.parse(localStorage.getItem(getKey));
                    if(value.unique_key == "toDoList" && value.public_id == decodedPublicId) {
                        localStorage.removeItem(getKey);
                    }
                }
            }
           
           
        }


    }, [filter_items, refresh]);

    function addIds(checked, id_to_be_deleted) {
        if(!checked) {
            setIds((item)=> [...item, id_to_be_deleted]);
            
        }
        else {
            setIds(ids.filter(item=> {
                return item !== id_to_be_deleted;
            }))
        }
    }
    
    function ls(e) {
    
        localStorage.setItem(e.target.id, serialize({public_id: decodedPublicId, unique_key: "toDoList", value:e.target.value}));
        
        
    }

    



    function addToDos() {
        const id = uuidv4();
 
        setToDo(toDo.concat({_Id: id, item_value: <PriorityLists id = {id} checked = {false} addIds = {addIds} local_storage ={ls} text_value = {null}   /> }));
        setIdsToRefresh(idsToRefresh.concat(id));
   
    }

  




    return (
    <div className = "main-content">
        <div className = "container-fluid">
            <div className = "row underline">
                <div className= "col">
                    <div className = "row">
                    <div className = "col-3 pt-2">
                        <Refresh setRefresh = {setRefresh} refresh = {refresh} />
                    </div>

                    <div className = "col-6 text-center">
                        <Header header ={"Tasks"}/>
                    </div>

                    <div className = "col-3 pt-2">
                      
                        <Delete setFilterItems = {setFilterItems} filter = {filter_items} />
                       
                    </div>

                    </div>
                </div>
            </div>

            <div className = "row">
                <div className = "col">
          
                   {
                   
                   
                   toDo.map(item=> {
                       return (<div key = {item._Id}> 
                       <ul>
                           <li>{item.item_value}</li>
                         
                       </ul>
                       </div>)
                   })}
                    
                   
 
                    
                </div>
            </div>


            <div className = "row">
                
                <div className = "col pr-4">
        
                    <Add addToDos = {addToDos} />
                
                </div>
            </div>



        
        </div>
    </div>
    
    )
}

export default Task;

