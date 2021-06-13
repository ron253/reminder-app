import React, {useState} from "react";


import {Form, Button,Popover, OverlayTrigger} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'


function ReminderLists(props) {

    const [isChecked, setChecked] = useState(false);
    const [changeInput, setChangeInput] = useState(props.text_value);
    const [reminderDate, setReminderDate] = useState(props.date)
    const [reminderTime, setReminderTime] = useState(props.time)
    const [enableDesktopNotification, setEnableDesktopNotification] = useState(props.notifyDesktop)
    const [daily, setDaily] = useState(props.dailyReminder)
    const [weekly, setWeekly] = useState(props.weeklyReminder)
    const [monthly, setMonthly] = useState(props.monthlyReminder)
    const [yearly, setYearly] = useState(props.yearlyReminder)
    const [unsubscribe, setUnsubscribe] = useState(props.unsubscribe)


    const [storeFormData, setFormData] = useState({
        reminderText: "", 
        reminderDate: props.date,
        reminderTime: props.time,
        enableDesktopNotification: props.notifyDesktop,
        daily: props.dailyReminder,
        weekly: props.weeklyReminder,
        monthly: props.monthlyReminder,
        yearly:props.yearlyReminder,
        unsubscribe: props.unsubscribe,
        id: props.id
    })
 
    const publicKey = "BJC37iFk2x1EjU-lVHrivl3QsFe2AiI43rBuXcT-3HX7lElLL4k3xNlmxr7k7tjPDiuzoFcZ8zB4PJB_7opIyW0"
    const baseUrl = "https://desktop-reminder.herokuapp.com/notification";
    const submissionUrl = "https://desktop-reminder.herokuapp.com/reminders";
  

    const header = {
        'Content-Type': 'application/json',
        'Authorization': props.token,
    }
 



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
    
        storeFormData.reminderText=e.target.value
      
    }

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
    
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
    
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    

    function handleSubmit(e) {

        
        e.preventDefault();
        fetch(submissionUrl, {
          method: 'POST',
          headers:header,
          body: JSON.stringify(storeFormData)
        }).then(res=>res.json()).then( ()=> {
            notify()
        })


        async function notify() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                navigator.serviceWorker.register("/sw.js").then(serviceWorkerRegistration => {
                  console.log('Service worker was registered.');
                  console.log({serviceWorkerRegistration});
                  serviceWorkerRegistration.update()
                }).catch(error => {
                  console.log('An error occurred while registering the service worker.');
                  console.log(error);
                });
              
              } else {
                console.log('Browser does not support service workers or push messages.');
                return;
            }

            const result = await Notification.requestPermission();
            console.log("Permission " + result)
            if (result === 'denied') {
                console.log('The user explicitly denied the permission request.');
                return;
            }
            if (result === 'granted') {
                console.log('The user accepted the permission request.');

                const registration = await navigator.serviceWorker.getRegistration();
                const subscribed = await registration.pushManager.getSubscription();

                if(storeFormData.unsubscribe) {
                    const unsubscribed = await subscribed.unsubscribe();
                    if (unsubscribed) {
                        console.log('Successfully unsubscribed from push notifications.');
                        fetch(baseUrl, {
                            method: "DELETE", 
                            headers:header

                        })
                    }
                    else {
                        console.log('Cannot unsubscribe from push notifications.');
                    }
                    return;
                }
                if (subscribed) {
                    console.log('User is already subscribed.');
                    
                    fetch(baseUrl, {
                        method: "POST", 
                        headers:header,
                        body: JSON.stringify({"subscription": " ", "subscriptionId": props.id, "daily":storeFormData.daily, 
                        "weekly": storeFormData.weekly, "yearly": storeFormData.yearly, "monthly": storeFormData.monthly})
                    }).then(res=>res.json()).then(res=> console.log(res))
                    return;
                }
                
              
          
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:  urlB64ToUint8Array(publicKey)
                   
                });

                fetch(baseUrl, {
                    method: "POST", 
                    headers:header,
                    body: JSON.stringify({"subscription":subscription, "subscriptionId": props.id, "daily":storeFormData.daily, 
                    "weekly": storeFormData.weekly, "yearly": storeFormData.yearly, "monthly": storeFormData.monthly})
                })
         
            }
        }

      

    }
    

    return ( 
        <Form>
            <fieldset>
                <div className = "input-group mb-3">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input unique_Key = {props.id}   onInput = {e=>   e.target.checked = isChecked} onClick={e=> check(e) } checked = {props.checked} id = "check-item" type="checkbox" aria-label="Checkbox for following text input"/>
                        </div>
                    </div>
                    <textarea id = {props.id} onChange = {e=>setChange(e)} value = {changeInput}  class="form-control"  rows="1" name = "reminderText" ></textarea>
                    <input type="date" id="start" name="reminderDate" 
                        onChange = {(e)=> {
                            setReminderDate(e.target.value) 
                            storeFormData.reminderDate = e.target.value
                            
                        }}
                        value = {reminderDate}
                        
                        ></input>
                    <input type="time" id="appt" name="reminderTime" min="09:00" max="18:00"
                    
                     onChange = {(e)=> {

                        setReminderTime(e.target.value) 
                        storeFormData.reminderTime = e.target.value
                     }

                        
                        
                        } value = {reminderTime}  required ></input>


                    <OverlayTrigger
                    trigger="click"
                    key={'bottom'}
                    placement={'bottom'}
                    overlay={
                    <Popover id={`popover-positioned-${'bottom'}`}>
                        <Popover.Title as="h3">{`Notification Settings`}</Popover.Title>
                        <Popover.Content>
         

                        <div>
                            <input  type="checkbox" id="desktop" name="enableDesktopNotification" value="desktop"
                            onChange = {()=>  {

                                
                                setEnableDesktopNotification(!enableDesktopNotification)
                                storeFormData.enableDesktopNotification = !storeFormData.enableDesktopNotification
                            }
                            
                
                            
                            }
                            checked = {enableDesktopNotification}
                            >



                            </input>
                            <label className = "padding-left" for="desktop">Enable Desktop</label>
                        </div>

                        <div>
                            <input  type="checkbox" id="desktop" name="unsubscribeToNotifications" value="desktop"
                            onChange = {()=> {

                                setUnsubscribe(!unsubscribe)
                                storeFormData.unsubscribe = !storeFormData.unsubscribe

                            }
                            
                            
                            
                             
                             
                              } checked = {unsubscribe}>
                            </input>
                            <label  for="desktop">Unsubscribe From Notification</label>
                        </div>

                        <div>
                            <input  type="checkbox" id="daily" name="daily" value="daily"
                            onChange = {()=> {

                                setDaily(!daily)
                                storeFormData.daily = !storeFormData.daily

                            }
                            
                          
                            
                            
                            
                            } checked = {daily}>
                            </input>
                            <label className = "padding-left" for="daily">Daily</label>
                        </div>

                        <div>
                            <input  type="checkbox" id="weekly" name="weekly" value="weekly"
                            onChange = {()=>  {
                                setWeekly(!weekly)
                                storeFormData.weekly = !storeFormData.weekly
                            }
                            
                           
                            
                            } checked = {weekly}>
                            </input>
                            <label className = "padding-left" for="weekly">Weekly</label>
                        </div>

                        <div>
                            <input  type="checkbox" id="monthly" name="monthly" value="monthly"
                            onChange = {()=>  {
                                setMonthly(!monthly)
                                storeFormData.monthly = !storeFormData.monthly
                            }
                            
                            
                             
                             } checked = {monthly}>
                            </input>
                            <label className = "padding-left" for="monthly">Monthly</label>
                        </div>

                        <div>
                            <input  type="checkbox" id="yearly" name="yearly" 
                            onChange = {()=> {

                                setYearly(!yearly)
                                storeFormData.yearly = !storeFormData.yearly
                            }
                            
                           
                             
                             
                             } checked = {yearly}>
                            </input>
                            <label className = "padding-left" for="yearly">Yearly</label>
                        </div>

                        <Button variant="primary" size="sm" type="submit" onClick = {handleSubmit}>Save</Button>
                 
                       
                        </Popover.Content>
                    </Popover>
                    }>

                    <Button className = "black app-btns " id="Popover1" type="button">
                        <FontAwesomeIcon icon = {faInfoCircle} size = "2x" />
                    </Button>
                    </OverlayTrigger>
                </div>
            </fieldset>
        </Form>



   
    )
}

export {ReminderLists};

