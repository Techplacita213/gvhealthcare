import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { LIVE_URL } from '../util/url'
import close from '../assets/close.svg'
import swal from 'sweetalert'
import draw from '../assets/draw.svg'
import {FaArrowLeft} from 'react-icons/fa' 

const AddSession=({state,setState,reload})=>{
    const [session,setSession]=useState({
        days:state.selectedObject.weeksApplied||[],
        name:state.selectedObject.name||"",
        start:state.selectedObject.start||"",
        end:state.selectedObject.end||""
    })
    const onChangeHandler=(e)=>{
        setSession({...session,[e.target.name]:e.target.value})
    }
    useEffect(()=>{

    },[state.refresh])
    const checkHandler=(e)=>{
        if(e.target.checked){
            let days=session.days
            days.push(e.target.name)
            setSession({...session,days:days})
        }else{
            let days=session.days
            days=days.filter(a=>a!=e.target.name)
            setSession({...session,days:days})
        }
        
    }
    const onSubmit=(e)=>{
        e.preventDefault()
        if(session.days.length===0){
            return swal("You need to select the days on which this Service is being provided. Can't leave all of them blank.",{
                icon:"warning"
            })
        }
        if(!state.editMode)
            axios.post(LIVE_URL+"api/session/add_session",{...session,serviceId:state._id,duration:state.duration},{withCredentials:true}).then((res)=>{
               
               
                let chg=state.sessions
                chg.push(res.data.session)
                if(state.sessions.length===0){
                    setState({...state,session:chg,duration:res.data.session.duration,disableDuration:true,showAdd:false})
                }
                else    
                    setState({...state,session:chg,disableDuration:true,showAdd:false})
            }).catch(err=> swal(err.response?.data?.message,{
                icon:"warning"
            })) 
        else{
            axios.post(LIVE_URL+"api/session/update_by_id",{...session,serviceId:state._id,duration:state.duration},{withCredentials:true}).then((res)=>{
                swal(res.data.message,{
                    icon:"success"
                })
                reload()
            }).catch(err=>{
                swal(err.response?.data?.message,{
                    icon:'warning'
                })
            })
        }  
        
    }
    return <div className="absolute top-0 bottom-0 right-0 left-0  flex items-center justify-center ">
        {/* <div onClick={()=>setState({...state,showAdd:false,editMode:false})} style={{zIndex:"0"}}className="absolute top-0 bottom-0 right-0 left-0 "></div> */}
        <div style={{zIndex:"1",width:'650px',height:"300px",boxShadow:"0px 0px 10px rgba(0,0,0,0.2)"}}  className="bg-white flex flex-col ">
            <div className="w-full p-2 bg-gray-200 flex flex-row justify-between">
                {!state.editMode?"Add Session":"Edit Session"}
                <img src={close} style={{width:"11px"}} onClick={()=>setState({...state,showAdd:false,editMode:false})}/>
            </div>
           <form onSubmit={onSubmit} className="flex flex-col items-center justify-around p-2 h-full">
                <div className="w-full">
                    <label className="text-darkgray mr-2">Session Name </label>
                    <input className="p-2 mb-2 rounded-md" value={session.name} style={{border:"solid gray 1px",paddingLeft:"4px"}} name="name" className="w-52"  onChange={onChangeHandler}/>
                </div>
                <div style={{flexWrap:"wrap"}} className="mt-6 ml-0 w-full flex flex-row">
                    <div className="mb-2 mr-5">
                        <label className="text-darkgray mr-2">Start Time</label>
                        <input className="p-0 mb-2 rounded-md" value={session.start} style={{border:"solid  1px",paddingLeft:"4px"}} type="time" name="start"  onChange={onChangeHandler}/>
                    </div>
                    <div className="">
                        <label className="text-darkgray mr-2">End Time</label>
                        <input  className="p-0 mb-2 rounded-md" value={session.end} style={{border:"solid gray 1px",paddingLeft:"4px"}} type="time" name="end"  onChange={onChangeHandler}/>
                    </div>
                </div>
                <div style={{width:'100%'}} className="flex flex-row flex-wrap items-center">
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                    <input type="checkbox" className="mr-1 larger" checked={session.days.includes("monday")?1:0} name="monday" onChange={checkHandler}/>
                    <label >Monday</label>
                        
                    </span>
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                        
                        <input type="checkbox" className="mr-1 larger" checked={session.days.includes("tuesday")?1:0} name="tuesday" onChange={checkHandler}/>
                        <label >Tuesday</label>
                    </span>
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                        
                        <input className="mr-1 larger" type="checkbox" checked={session.days.includes("wednesday")?1:0} name="wednesday" onChange={checkHandler}/>
                        <label >Wednesday</label>
                    </span>
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                      
                        <input className="mr-1 larger" type="checkbox" checked={session.days.includes("thrusday")?1:0} name="thrusday" onChange={checkHandler}/>
                        <label >Thrusday</label>
                    </span>
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                        
                        <input className="mr-1 larger" type="checkbox" checked={session.days.includes("friday")?1:0} name="friday" onChange={checkHandler}/>
                        <label >Friday</label>
                    </span>
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                        
                        <input  className="mr-1 larger" type="checkbox" name="saturday" checked={session.days.includes("saturday")?1:0} onChange={checkHandler}/>
                        <label>Saturday</label>
                    </span>
                    <span className="m-1 flex flex-row w-18 items-center" style={{width:"100px"}}>
                        
                        <input className="mr-1 larger" type="checkbox" name="sunday" checked={session.days.includes("sunday")?1:0} onChange={checkHandler}/>
                        <label>Sunday</label>
                    </span>
                </div>
                <button type="submit"  className="text-white p-1 bg-gray-500 m-auto w-48 mt-3 mb-2">{state.editMode?"Update":"Submit"}</button>
            </form>
        </div>
    </div>
}
export default function AddService({state,setState,reload}) {
    const [edit,setEdit]=useState({
        showAdd:false,
        sessions:[],
        editMode:false,
        selectedObject:{},
        disableDuration:false,
        duration:"",
        refresh:0,
        ...state
    })
    useEffect(()=>{
        console.log(edit)
        axios.post(LIVE_URL+'api/session/get_all',{_id:state._id}).then((res)=>{
            if(res.data.sessions.length>0)
                setEdit({...edit,sessions:res.data.sessions,duration:res.data.sessions[0].duration,disableDuration:true})
            else
                setEdit({...edit,sessions:res.data.sessions,duration:"",disableDuration:false})
        }).catch(err=>console.log(err))
    },[edit.refresh])
    const onChangeHandler=(e)=>{
        setEdit({...edit,[e.target.name]:e.target.value})
    }
    const editMode=(obj)=>{
        setEdit({...edit,editMode:true,showAdd:true,selectedObject:obj,duration:obj.duration})
    }
    const Delete=(id)=>{
        console.log(id)
        axios.post(LIVE_URL+"api/session/delete_session",{sid:id},{withCredentials:true}).then((res)=>{
            swal(res.data.message,{
                icon:"success"
            })
            setEdit({...edit,refresh:edit.refresh+1})
        }).catch(err=>{
            console.log(err.response.data)
        })
    }
    const reLoad=()=>{
        setEdit({...edit,refresh:edit.refresh+1,editMode:false,showAdd:false})
    }
    const Submit=()=>{
        if(edit.ename===""){
            return swal("Service Name is required!",{
                icon:"warning"
            })
        }
        if(edit.echarge<=0){
            return swal("Service Charge Should be grater than 0!",{
                icon:"warning"
            })
        }
        
        axios.post(LIVE_URL+'api/service/update_by_id',{name:edit.ename,charge:edit.echarge,_id:edit._id,status:edit.status,description:edit.description||""},{withCredentials:true}).then((res)=>{
            swal(res.data.message,{
                icon:'success'
            })
            setState({...state,showEdit:false})
            reload()
        }).catch((err)=>{
            swal(err.response?.data.message||"Something Went Wrong!",{
                icon:"warning"
            })
        })
    }
    return (
        <div className="pl-6" style={{top:0,bottom:0,left:0,right:0,position:"absolute",backgroundColor:"white"}} className="flex flex-col">
            <div className="w-full p-4 cursor-pointer flex flex-row items-center block  border-b-0 border  border-gray-200 text-grey-100 font-sm bg-gray-200">
                <div className="flex flex-row items-center"><FaArrowLeft onClick={()=> setState({...state,showEdit:false})} style={{marginRight:"10px"}}/>Edit Service</div>
               
            </div>
            <div >
            <div  className="flex flex-col p-4 mt-8">
            <div className="mb-4">
                <label className="text-darkgray mr-2">Service Name </label>
                <input readOnly className="p-2 mb-2 rounded-md" value={edit.ename} style={{border:"solid gray 1px"}} name="ename" className="w-52"  onChange={onChangeHandler}/>
            </div>
            <div className="flex flex-row items-center">
                <label className="text-darkgray mr-2 flex flex-row items-center" style={{marginRight:"28px"}}>Description </label>
                <textarea className="p-2 mb-2 rounded-md" value={edit.description} style={{border:"solid gray 1px"}} name="description" className="w-52"  onChange={onChangeHandler}/>
            </div>
            <div style={{flexWrap:"wrap",width:"90%"}} className="m-6 ml-0 flex flex-row justify-between">
                <div className="mb-1">
                    <label className="text-darkgray mr-14">Charge</label>
                    <input className="p-2 mb-2 rounded-md"  value={edit.echarge} style={{border:"solid  1px"}} name="echarge" className="w-52"  onChange={onChangeHandler}/>
                </div>
                <div className="mt-1">
                    <label className="text-darkgray mr-9">Slot Duration (in minutes)</label>
                    <input  className="p-2 mb-2 rounded-md" style={{border:"solid gray 1px"}} type="number" name="duration" disabled={edit.disableDuration} value={edit.duration} className="w-52"  onChange={onChangeHandler}/>
                </div>
            </div>
            <div className=" mb-8">
                <label className="mr-2">Active </label>
                <label class="switch">
                    <input onChange={e=>setEdit({...edit,status:e.target.checked})} checked={edit.status} type="checkbox"/>
                    <span  class="slider round"></span>
                </label>
            </div>
           
            <div style={{width:"95%",marginBottom:"10px"}}>
            <h2>Manage Session</h2>
            <button onClick={()=>{
               if(!edit.duration)
                return swal("Before Adding Sessions, please enter the Slot Duration required for each booking",{
                    icon:"warning"
                })
               setEdit({...edit,showAdd:true,selectedObject:{}})}} style={{float:"right",color:"blue"}}>+ Add More Sessions</button>
            </div>
            <div>
                <table style={{width:"100%"}}>
                    {
                        edit.sessions.map(obj=>{
                            return <tr style={{width:"100%"}}>
                                <td>{obj.name}</td>
                                <td>{obj.start}</td>
                                <td>to</td>
                                <td>{obj.end}</td>
                                <td>{obj.duration} Minutes</td>
                                <td>[{
                                        obj.weeksApplied.map((weekName,index)=>{
                                            return <span>{weekName[0].toUpperCase()+weekName[1]+weekName[2]}{index==obj.weeksApplied.length-1?"":", "}</span>
                                        })
                                    }]
                                </td>
                                <td style={{display:"flex",flexDirection:"row"}}>
                                    <img onClick={()=>{editMode(obj)}} src={draw} style={{width:"15px",marginRight:"10px"}} />
                                    <img src={close} onClick={()=>{Delete(obj._id)}}  style={{width:"15px"}} />
                                </td>
                            </tr>
                        })
                    } 
                </table>
            </div>
           <button onClick={Submit} style={{marginTop:"35px"}} className="text-white p-1 bg-gray-500 m-auto w-48">Submit</button>
            {edit.showAdd?<AddSession state={edit} setState={setEdit} reload={reLoad}/>:null}
            </div>
            </div>
        </div>
    )
}
