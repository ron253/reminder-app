import React, {useState, useEffect} from "react";
import {PriorityHeader} from "../components/Header";


import PriorityContext from "../components/PriorityContext";




function Home() {
    const [quote, setQuote] = useState([])
    const [author, setAuthor] = useState()
    const {priorityLists} = React.useContext(PriorityContext);
    const {token} = React.useContext(PriorityContext);

    const header = {
        'Content-Type': 'application/json',
        'Authorization': token,
    }

    useEffect(()=> {
        fetch("https://desktop-reminder.herokuapp.com/quote", {
            method: "GET", 
            headers:header
        }).then(res=>res.json()).then(res=> {
            setQuote(res.quote)
            setAuthor(res.author)
        })


    }, [])
    return (

        <div className = "main-content">
            <div className = "container-fluid">
                <div className = "row underline">
                    <div className= "col text-center">
                        <PriorityHeader />
                    </div>
                </div>

                <div className = "row">
                    <div className = "col">
                        {
                            quote.map(quote=> {
                                return (
                                <div> 
                                    <blockquote id = "quote">
                                        {quote}
                                    </blockquote>
                                    <footer><span>-</span>{author}</footer>

                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;


