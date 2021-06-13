import React from "react";
import { Button} from 'reactstrap';
import {Header} from "../components/Header";
import PriorityContext from "../components/PriorityContext";
import {useHistory} from "react-router-dom";
function Settings() {

    const {setToken} = React.useContext(PriorityContext);
    let history = useHistory();
    const baseUrl  = "https://desktop-reminder.herokuapp.com/logout";

    function handleSubmit(e) {
        e.preventDefault();
    
        fetch(baseUrl, {
          method: 'POST'
      
        }).then(response=>response.json()).
        then(res=> {
            if (res.logOut)
                setToken(null)
                history.push('/')
                
        })

    }
    return (
        <form onSubmit = {handleSubmit}>
            <div className = "main-content">
                <div className = "container-fluid">
                    <div className = "row underline">
                        <div className= "col">
                            <div className = "row">
                    

                                <div className = "col text-center">
                                    <Header header = {"Settings"}/>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className = "row">
                        
                        <div className = "col">
                            <Button className = "adjust-content-btns" variant="primary" type="submit" >Logout</Button>
                    
                        
                        
                        </div>
                    </div>
            



            
                </div>
            </div>
        </form>
        
    )
}

export default Settings;

