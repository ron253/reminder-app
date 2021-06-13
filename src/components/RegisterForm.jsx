import React, {useState, useRef} from 'react';
import {Form} from "react-bootstrap";
import { Button } from 'react-bootstrap';

import { useHistory } from "react-router-dom";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import PriorityContext from "../components/PriorityContext";

function RegisterForm() {

    const [passwordError, setPasswordError] = useState();
    const [duplicateEmailError, setEmailError] = useState();
    const {setAccountCreatedMessage} = React.useContext(PriorityContext);
    const [value, setValue] = useState();
    const form = useRef(null);
    let history = useHistory();
    const baseUrl = "https://desktop-reminder.herokuapp.com/register";

    function redirectToSignIn() {
        history.push("/")
    };

    function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(form.current);
    
        fetch(baseUrl, {
          method: 'POST',
          body: data
        }).then(response=>response.json()).
        then(res=> {
            if(res.message) {
                setAccountCreatedMessage(true);
                history.push("/");
                
            }

            else if(res.passwordError) {
                setPasswordError(res.passwordError);
                setEmailError("");
            }

            else  {
                setEmailError(res.duplicateEmailError);
                setPasswordError("");
            }
        })

    }
    return (
        <div class = "w-50 text-center adjust-form">
            <div class = "content-section ">
                <Form ref={form} id = "registerForm" onSubmit = {handleSubmit} action = "http://127.0.0.1:5000/register" method = "POST">
                    <legend class="border-bottom mb-4 pl-5">Sign Up To Create Reminders!</legend>
                    <fieldset class="form-group ">

                    <Form.Group className = "w-50 adjust-form-group " controlId="formPersonName"  >
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Your Name" name = "personName" required/>
                    </Form.Group>

                    <Form.Group className = " w-50 adjust-form-group" controlId="formBasicEmail">
                        <Form.Text id="conformPasswordHelpBlock" >
                        {duplicateEmailError}
                        </Form.Text>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter Your email" name = "personEmail" required/>
                        <Form.Text className="text-muted">
                         We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
      
                    <Form.Group className = "w-50 adjust-form-group" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name = "password" minlength = "8" maxlength = "20" required/>
                        <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className = "w-50 adjust-form-group" controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" name = "confirmPassword" required/>
                        <Form.Text id="conformPasswordHelpBlock" >
                        {passwordError}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className = "w-50 adjust-form-group" controlId="formNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <PhoneInput placeholder="Enter phone number" value={value} onChange={setValue} name = "phoneNumber" required/>
                        <small class="text-muted">
                        Your number is used for sending you reminders only.
                        </small>
                    </Form.Group>


                    <Button className = "adjust-content-btns" variant="primary" type="submit">
                        Submit
                    </Button>
                    </fieldset>
                </Form>
                </div>
                <div class="border-top pt-3">
                    <small class="text-muted adjust-content-acc">
                        Already Have An Account? <a class="ml-2" onClick = {redirectToSignIn}>Sign In</a>
                    </small>
                </div>
        </div>
        

        
       
      
    );
    
}

export default RegisterForm;