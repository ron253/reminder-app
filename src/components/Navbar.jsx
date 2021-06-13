import React from "react";
import { Nav, NavItem} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faBell, faClipboardList, faCog} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";


function NavBar() {
    
    return (
        <div className = "sideBar">
            <Nav vertical>
                <NavItem className = "mb-5">
                    <Link  to = "/quote" className = "text-success" ><span className = "text ml-5"><FontAwesomeIcon icon = {faStar}/>Daily Quotes</span></Link>
                </NavItem>
                <NavItem className = "mb-5">
                    <Link  to = "/reminders/user" className = "text-success" ><span className = "text ml-5"><FontAwesomeIcon icon = {faBell}/> Reminder</span></Link>
                </NavItem>
                <NavItem>
                    <Link to = "/tasks" className = "text-success" ><span className = "text ml-5"><FontAwesomeIcon icon = {faClipboardList}/> Tasks</span></Link>
                </NavItem>
                
                <NavItem className = "fixed-bottom">
                    <Link to = "/settings" className = "text-success">
                        <FontAwesomeIcon icon = {faCog} size = "2x" />
                    </Link>
                </NavItem>
            
            </Nav>
        </div>
        
    )
}

export default NavBar;


