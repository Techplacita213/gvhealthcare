import React,{useEffect, useState} from 'react'
import Close from '../assets/close.svg'
import Pen from '../assets/draw.svg'
import axios from 'axios'
import {LIVE_URL} from '../util/url'
import AddService from '../Components/AddService'
import close from '../assets/close.svg'
import swal from 'sweetalert';

let initState={
    services:[],
    name:"",
    charge:0,
    ename:"",
    _id:"",
    showEdit:false,
    showAdd:false,
    refresh:0
}

const Edit=({name,_id,state,setState})=>{
    const [edit,setEdit]=useState({name:"",status:true})
    const onSubmit=(e)=>{
        e.preventDefault()
        axios.post(LIVE_URL+'api/service/add',{
            name:edit.name,
            charge:edit.charge,
            status:edit.status,
            description:edit.description
        },{withCredentials:true}).then((res)=>{
            let chg=state.services
            chg.push({...res.data.service})

            swal('Service has been added successfully, press Continue to proceed for creating the Booking Slots',{button:"Continue"})
            .then((value) => {
            if(value)
                setState({...state,services:chg,showEdit:true,showAdd:false,ename:edit.name,echarge:res.data.service.charge,_id:res.data.service._id,status:res.data.service.active,description:edit.description})
            else
            setState({...state,services:chg,showEdit:false,showAdd:false,ename:edit.name,echarge:res.data.service.charge,_id:res.data.service._id,status:res.data.service.active})
            });

            
        }).catch(err=>console.log(err.response))
    }
    const onChangeHandler=(e)=>{
        setEdit({...edit,[e.target.name]:e.target.value})
    }
    
    return <div  className="absolute top-14 bottom-0 right-0 left-0 flex  justify-center ">
        {/* <div onClick={()=>setState({...state,showAdd:false})} style={{zIndex:"0"}}className="absolute top-0 bottom-0 right-0 left-0"></div> */}
        <div  style={{zIndex:"1",border:"solid #f1f1f1 1px",width:"80%",height:"390px",boxShadow:"0px 0px 10px rgba(0,0,0,0.2)"}} className="bg-white pb-2 pt-0  flex flex-col">
            <div className="w-full p-2 bg-gray-200 flex  flex-row justify-between">
                Add Service
                <img src={close} style={{width:"11px"}} onClick={()=>setState({...state,showAdd:false,editMode:false})}/>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col p-2 items-center justify-around h-full">
                <div className="w-full mb-2">
                    <label className="text-darkgray mr-2">Service Name </label>
                    <input required={true} className="p-2 mb-2 " value={edit.name} style={{border:"solid gray 1px",paddingLeft:"4px"}} name="name" className="w-52"  onChange={onChangeHandler}/>
                </div>
                <div className="w-full mb-2 ">
                    <label className="text-darkgray" style={{marginRight:"54px"}}>Charge </label>
                    <input required={true} className="p-2 mb-2 " value={edit.charge} style={{border:"solid gray 1px",paddingLeft:"4px"}} name="charge" className="w-52"  onChange={onChangeHandler}/>
                </div>
                <div className="w-full flex flex-row items-center">
                    <label className="text-darkgray" style={{marginRight:"29px"}}>Description </label>
                    <textarea required={true} className="p-2 mb-2 " value={edit.description} style={{border:"solid gray 1px",paddingLeft:"4px"}} name="description" className="w-52"  onChange={onChangeHandler}/>
                </div>
                <div className=" w-full m-4">
                <label className="mr-2">Active </label>
                <label class="switch">
                    <input onChange={e=>setEdit({...edit,status:e.target.checked})} checked={edit.status} type="checkbox"/>
                    <span  class="slider round"></span>
                </label>
            </div>
                <button type="submit"  className="text-white p-1 bg-gray-500 m-auto  w-48 mt-3 mb-2">Submit</button>
            </form>
        </div>
    </div>
}

export default function ManageServices() {
    const[state,setState]=useState(initState)
    const onChangeHandler=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
    }
    useEffect(()=>{
        axios.get(LIVE_URL+'api/service/get_all',{withCredentials:true}).then((res)=>{
            setState({...state,...res.data})
        }).catch(err=>{
            console.log(err.response)
        })
    },[state.refresh])
    const onSubmit=(e)=>{
        e.preventDefault()
        axios.post(LIVE_URL+'api/service/add',{name:state.name,charge:state.charge},{withCredentials:true}).then((res)=>{
            console.log(res.data)
            let ser=state.services
            ser.push({...res.data.service})
            setState({...state,services:ser})
        }).catch((err)=>{
            console.log(err.response)
        })
    }
    const reload=()=>{
        setState({...state,refresh:state.refresh+1,showEdit:false,showAdd:false})
    }
    const Delete=(id)=>{    
        swal({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                
                swal({
                    title: "Please punch in your admin password to Confirm This deletion.",
                    text:"Note: This is an irreversible action.",
                    button: {
                        text: "Delete",
                        closeModal:false
                      },
                    content:"input",
                    type:"password",
                    dangerMode: true,
                  }).then(pass => {
                    if(!pass) return 
                    axios.post(LIVE_URL+'api/service/delete_by_name',{
                        _id:id,
                        pass:pass
                    },{withCredentials:true}).then((res)=>{
                        let chg=state.services
                        chg=chg.filter((obj)=>{
                            return obj._id!=id
                        })
                        setState({...state,services:chg})
                        swal.stopLoading()
                        swal.close()
                    }).catch(err=>{
                        swal("wrong credentials!",{
                            icon:'danger'
                        })
                        swal.stopLoading()
                    })
                  })
                  
              
            } else {
             
            }
          });
       
        
    }
    return (
        <div  className=" w-full relative">
            <div className="w-full p-4 cursor-pointer flex flex-row items-center justify-between block  border-b-0 border  border-gray-200 text-grey-100 font-sm bg-gray-200">
                <div>Services</div>
               <div>
               <button onClick={()=>{
                    setState({...state,showAdd:true})
                }} style={{color:"blue"}}>+ Add More Services</button>
               </div>
            </div>
            <div style={{width:"90%"}} className="flex flex-row justify-end">
            
            </div>
            <div style={{flexWrap:"wrap",width:"100%"}} className="flex flex-row justify-center">
                <table id="alter" style={{width:"100%"}}>
                    <tr>
                        <th className="pb-2">Service</th>
                        <th className="pb-2">Charges</th>
                        <th className="pb-2"></th>
                        <th className="pb-2">Status</th>
                    </tr>
                {
                    state.services.map(obj=>{
                        console.log(obj)
                        return <tr>

                            <td style={{textAlign:"left",minWidth:'210px'}}>
                                {obj.name}
                            </td>
                            <td  style={{textAlign:"left"}}>
                                {obj.charge}
                            </td>
                            <td>
                                <div className="pl-12 flex flex-row justify-end" style={{width:"190px",textAlign:"left"}}>
                                    <span onClick={()=>{
                                        setState({...state,showEdit:true,ename:obj.name,echarge:obj.charge,_id:obj._id,status:obj.active,description:obj.description})
                                    }} style={{color:"blue",fontSize:"14px"}} className="mr-3">
                                        Manage Slots
                                    </span>
                                    <img onClick={()=>{Delete(obj._id)}}src={Close} style={{width:"7px"}}/>
                                </div>
                            </td>
                            <td>
                                {obj.active?"active":"deactive"}
                            </td>
                        </tr>
                    })
                }
                </table>
               
            </div>
           
                {/* <input className="p-1 mb-2 rounded-md" name="name" required={true} value={state.name} onChange={onChangeHandler}/>
                <input className="p-1 mb-2 rounded-md" type="number" name="charge" required={true} value={state.charge} onChange={onChangeHandler}/> */}
                
          
            {state.showEdit?<AddService state={state} setState={setState} reload={reload}/>:null}
            {state.showAdd?<Edit name={state.ename} _id={state._id} state={state} setState={setState}/>:null}
        </div>
    )
}
