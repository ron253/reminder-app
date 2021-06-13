import React, {useState, useEffect}  from "react";
import {Delete, Refresh, Add} from "../components/Actions";
import {Header} from "../components/Header";
import {ReminderLists} from "../components/ReminderLists";
import {v4 as uuidv4} from 'uuid';
import { serialize} from "react-serialize";
import PriorityContext from "../components/PriorityContext";
import jwt_decode from "jwt-decode"

function Reminder() {
    const [toDo, setToDo] = useState([]);
    const [idsToRefresh, setIdsToRefresh] = useState([]);
    const [filter_items, setFilterItems] = useState(false);
    const [ids, setIds] = useState([]);
    const {token} = React.useContext(PriorityContext);
    const [refresh, setRefresh] = useState(false);
    const decodedPublicId = jwt_decode(token)['public_id'];
  
    const header = {
        'Content-Type': 'application/json',
        'Authorization': token,
    }

    const baseUrl = "https://desktop-reminder.herokuapp.com/reminders/user";
 
    useEffect(()=> {
        fetch(baseUrl, {
            method: 'GET',
            headers:header
        }).then(res=>res.json()).then(res=> {

            let arrItems = res["items"].map(item=> {
                setIdsToRefresh([...idsToRefresh, item.subscriptionId])
                return {
                    _Id: item.subscriptionId, 
                    item_value: 
                        <ReminderLists 
                            id = {item.subscriptionId} 
                            checked = {false}

                            addIds = {addIds} 
                    
                            text_value = {item.text}  
                            date = {item.reminderDate}
                            time = {item.reminderTime}
                            notifyDesktop = {item.notifyDesktop}
                            dailyReminder = {item.dailyReminder}
                            weeklyReminder = {item.weeklyReminder}
                            monthlyReminder = {item.monthlyReminder}
                            yearlyReminder = {item.yearlyReminder}
                            unsubscribe  = {item.unsubscribe}
                            token = {token} 

                        />
                }
            
            })

            setToDo(toDo.concat([...arrItems, toDo]));


        })
   
    }, [])

    useEffect(() => {
        if(toDo[0] !== undefined) {
           

            if(filter_items) {
                setToDo(toDo.filter(item=> {
                    return !ids.includes(item._Id);
                }))
    
                let url = new URL(baseUrl);
                let params = {"SubscriptionIds" : [...ids]};
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
                fetch(url, {
                    method: 'DELETE',
                    headers:header
                }).then(res=>res.json()).then(res=> 
                    console.log(res)
                )
            }
               

            if(refresh) {
                setToDo(toDo.filter(item=> {
                    return !idsToRefresh.includes(item._Id)
                }))

                let url = new URL(baseUrl);
                let params = {"SubscriptionIds": [...idsToRefresh]}

                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
                fetch(url, {
                    method: 'DELETE',
                    headers:header
                }).then(res=>res.json()).then(res=> 
                    console.log(res)
                )


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



    function addToDos() {
        const id = uuidv4();
        setToDo(toDo.concat(
            {_Id: id, 
            item_value:
            <ReminderLists  
            id = {id} 
            checked = {false} 
            addIds = {addIds} 
      
            text_value = {null} 
            date = {""}
            time = {""}
            notifyDesktop = {false}
            dailyReminder = {false}
            weeklyReminder = {false}
            monthlyReminder = {false}
            yearlyReminder = {false}
            unsubscribe  = {false}
            token = {token} 

            />}));
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
                        <Header header = {"Reminders"} />
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
                           <li>{item.item_value} </li>
                         
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

export default Reminder;






