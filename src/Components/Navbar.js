import React,{useEffect, useState} from 'react'
import axios from 'axios'
import {LIVE_URL} from '../utils/url'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [state,setState]=useState({
        name:"",
        toDisplay:false,
        logo:""
    })
    useEffect(()=>{
        axios.get(LIVE_URL+'api/company/getDetailes',{withCredentials:true}).then(res=>{
            setState({...state,name:res.data.companyName,toDisplay:res.data.displayLogo,logo:res.data.companyLogo})
            
        }).catch(err=>console.log(err))
    },[])
    return (
        <div style={{width:"100%",height:"70px",backgroundColor:"#f1f1f1",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:"0 20px 0 20px"}}>
            Docto
            <a href={process.env.NODE_ENV==="development"?
    "https://localhost:3000/"
:
"https://admin.healthcaregv.com/"}>
                <button className="button">
                    Doctor Login / Registeration
                </button>
            </a>
        </div>
    )
}
