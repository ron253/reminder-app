import React, {useState, useRef} from 'react';
import {Form} from "react-bootstrap";
import { Button } from 'react-bootstrap';

import {useHistory} from "react-router-dom";

import PriorityContext from "../components/PriorityContext";
function LoginForm() {

    const {setToken,showAccountCreatedMessage} = React.useContext(PriorityContext);
    const [error, setError] = useState();
    let history = useHistory();
    const form = useRef(null);
    const baseUrl = "https://desktop-reminder.herokuapp.com/login";


   

    function redirectToRegister() {
        history.push('/register')
      
    }
 
 

    function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(form.current);
    
        fetch(baseUrl, {
          method: 'POST',
          body: data
        }).then(response=>response.json()).
        then(res=> {
            if(res.token) {
                setToken(res['token']);
            } else {
                setError(res.errorMessage);
            }
            
        })

    }

    return (
        <div class = "w-50 text-center adjust-form">
            <div class = "content-section ">
                <Form ref={form} onSubmit = {handleSubmit} >
                {showAccountCreatedMessage ? <div class="alert alert-success" role="alert">
                Account Has Been Created! Pleae log in with your new account. 
                </div> :  <legend class="border-bottom mb-4 pl-5">Sign In To Create Reminders!</legend>}
    
                    <fieldset class="form-group ">
                    <small> {error} </small>
                    <Form.Group className = " w-50 adjust-form-group" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter Your email"  name = "personEmail" />
              
                    </Form.Group>
      
                    <Form.Group className = "w-50 adjust-form-group" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name = "password"  />
                  
                    </Form.Group>

          


                    <Button className = "adjust-content-btns" variant="primary" type="submit">
                        Submit
                    </Button>
                    </fieldset>
                </Form>
                </div>
                <div class="border-top pt-3">
                    <small class="text-muted adjust-content-acc">
                        Don't Have An Account? <a class="ml-2" onClick = {redirectToRegister} >Sign Up</a>
                    </small>
                </div>
        </div>
        

        
       
      
    );
    
}

export default LoginForm;