import React, {useState, useEffect} from 'react';
import NavBar from "./Navbar";
import Reminder from "../Reminder/reminder";
import Home from "../Home/home";
import Task from "../Tasks/tasks";
import Settings from "../Settings/settings"
import {Switch,Route } from "react-router-dom";
import PriorityContext from "../components/PriorityContext";
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
function App() {
  
  

  const [token, setToken] = useState(null);
  const [showAccountCreatedMessage, setAccountCreatedMessage] = useState(false);

  
  return ( 
    token ? ( 
    <div>
      <NavBar />
      <Switch>
        <Route exact path = "/quote" >
          <PriorityContext.Provider value= {{token}} >
            <Home />
            
          </PriorityContext.Provider>
        </Route>

        <Route exact path = "/reminders/user">
          <PriorityContext.Provider value = {{token}}>
            <Reminder />
          </PriorityContext.Provider>
        </Route>

      

        <Route path = "/tasks">
          <PriorityContext.Provider value= {{token}} >
            <Task />
          </PriorityContext.Provider>
        </Route>

        <Route path = "/settings">
          <PriorityContext.Provider value= {{setToken}}>
            <Settings />
          </PriorityContext.Provider>
        </Route>
     
      
      </Switch>
  
    </div>):
      <Switch>
        <Route exact path = "/">
          <PriorityContext.Provider value= {{setToken, showAccountCreatedMessage, setAccountCreatedMessage}} >
            <LoginForm  />
          </PriorityContext.Provider>
      
        </Route>

        <Route path = "/register">
          <PriorityContext.Provider value= {{setAccountCreatedMessage}}>
            <RegisterForm/>
          </PriorityContext.Provider>
        
        </Route>
      </Switch>
   
  )
}

export default App;
