import React,{useContext} from 'react'
import axios from 'axios'
import {LIVE_URL} from '../util/url'
import {authContext} from '../Context/AuthContext'

export default function Header() {
    const {state,dispatch}=useContext(authContext)
    const logout=()=>{
        axios.get(LIVE_URL+'api/admin/logout',{withCredentials:true}).then((res)=>{
            dispatch({type:"LOG_OUT"})
        }).catch(err=>console.log(err))
    }
    return (
        <div className="flex flex-row p-5 justify-between bg-gray-300 mb-8">
            <div>
                Docto
            </div>

            <div onClick={()=>logout()} className="cursor-pointer">
                Logout
            </div>
            
        </div>
    )
}
