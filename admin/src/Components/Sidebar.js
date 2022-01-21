import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {FaCalendarCheck,FaServicestack, FaCog, FaCalendar} from 'react-icons/fa'

 const Sidebar=()=>{
    let location = useLocation();
    return (
        <div style={{boxShadow:"0px 0px 10px rgba(0,0,0,0.2)",zIndex:'2'}} className="w-72 h-screen bg-white">
           <Link
            to="/ManageServices"
            className={`w-full p-4 cursor-pointer flex flex-row items-center block  border-b-0 border  border-gray-200 text-grey-100 font-sm 
             ${location.pathname === "/ManageServices" ?"bg-gray-200":"text-darkgray"}
            `}
          >
           <FaServicestack style={{marginRight:"20px"}}/> <div>Manage Services</div>
          </Link>
          <Link
            to="/pay"
            className={`w-full p-4 cursor-pointer flex flex-row items-center block  border border-gray-200  text-grey-100 font-sm 
             ${location.pathname === "/pay" ? "bg-gray-200":"text-darkgray"}
            `}
          >
            <FaCalendarCheck style={{marginRight:"20px"}}/><div>Payments</div>
          </Link>
          <Link
            to="/reports"
            className={`w-full p-4 cursor-pointer flex flex-row items-center block  border border-gray-200  text-grey-100 font-sm 
             ${location.pathname === "/reports" ? "bg-gray-200":"text-darkgray"}
            `}
          >
            <FaCalendar style={{marginRight:"20px"}}/><div>Reports</div>
          </Link>
          <Link
            to="/articles"
            className={`w-full p-4 cursor-pointer flex flex-row items-center block  border border-gray-200  text-grey-100 font-sm 
             ${location.pathname === "/articles" ? "bg-gray-200":"text-darkgray"}
            `}
          >
            <FaCalendar style={{marginRight:"20px"}}/><div>Articles</div>
          </Link>
        </div>)
}
export default Sidebar