import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCog} from '@fortawesome/free-solid-svg-icons'
import Link from "./Link";


function Footer(props) {
    return (
        <div class = "footer">
          {props.children}
        </div>
    )
  
}


export default Footer;