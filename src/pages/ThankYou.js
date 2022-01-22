import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {LIVE_URL} from '../utils/url'


export default function ThankYou() {
    const [state,setState]=useState({})
    const {id}=useParams()
    useEffect(()=>{
        console.log(id)
        axios.post(LIVE_URL+'api/slot/get_detail_booked',{orderId:id}).then((res)=>{
            setState({...state,...res.data.book})
            alert(res.data.message)
        }).catch((err)=>{
            console.log(err?.response)
            alert("Something Went Wrong!")
        })
    },[])  
    return (
        state.slotDetailes?
        <div className="card" style={{borderRadius:"5px",marginTop:"20px"}}>
            <div style={{width:"min-content",margin:"auto"}}>
                <img src="https://icon-library.com/images/success-icon-png/success-icon-png-8.jpg" style={{width:"70px"}}/>
            </div>
            
            <h2 style={{textAlign:"center",marginTop:"20px",marginBottom:"20px",fontWeight:"500",fontSize:"18px"}}>Your Booking has been confirmed for:</h2>
            <h4>Service: {state.serviceName}</h4>
            <h4>Date: {state.date}</h4>
            <h4>Time: {state.slotDetailes?.startTime}-{state.slotDetailes?.endTime}</h4>
        </div>:"loading..."
    )
}
