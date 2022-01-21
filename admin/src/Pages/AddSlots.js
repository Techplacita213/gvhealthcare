import React, { useEffect, useState } from 'react'
import axios from 'axios'
import pencil from '../assets/draw.svg'
import close from '../assets/close.svg'
import './slot.css'
import {LIVE_URL} from '../util/url'

const days=['monday','tuesday','wednesday','thrusday','friday','saturday','sunday']

const initState={
    monday:{},
    tuesday:{},
    wednesday:{},
    thrusday:{},
    friday:{},
    saturday:{},
    sunday:{},
    day:"",
    show:false,
    sessions:[],
    changing:true,
    applyDay:""
}

const Add=({state,setState,day})=>{
    const [data,setData]=useState({
        startTime:"",
        endTime:"",
        session:""
    })
    const onChangeHandler=(e)=>{
        setData({...data,[e.target.name]:e.target.value})
      }
    useEffect(()=>{
        axios.get(LIVE_URL+'api/session/get_all',{withCredentials:true}).then(res=>{
                setState({...state,...res.data})
    }).catch(err=>{console.log(err)})
    },[])
    const onSubmit=(e)=>{
        e.preventDefault()
        axios.post(LIVE_URL+'api/slot/add_by_day',{...data,day:day},{withCredentials:true}).then((res)=>{
           let dy=state[day]
           dy.push({data})
           console.log(dy)
           setState({...state,[day]:dy})
        }).catch(err=>console.log(err.response))
    }
    return(
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-40 flex items-center justify-center ">
           
            <div className="bg-white p-2 rounded-md">
            <div onClick={()=>setState({...state,show:false})} className="flex flex-row justify-end cursor-pointer">x</div>
                <form onSubmit={onSubmit}>
                    <input name="startTime" onChange={onChangeHandler} type="time" className="mr-2"/>
                    <input name="endTime" onChange={onChangeHandler} type="time"/>
                    <select name="session" onChange={onChangeHandler} className="w-full p-1 rounded-md flex flex-wrap">
                        <option value="">none</option>
                        {state.sessions.map(obj=>{
                            return <option style={{width:"min-width"}} value={obj.name}>{obj.name}</option>
                        })}
                    </select>
                    <button type="submit" className="w-full mt-2 p-1 text-white bg-blue-400 rounded-md">Add</button>
                </form>
            </div>
        </div>
    )
}

export default function AddSlots() {
    const [state,setState]=useState(initState)
    
    useEffect(()=>{
        axios.get(LIVE_URL+"api/slot/get_week",{withCredentials:true}).then((res)=>{
            setState({...state,...res.data,changing:false})
            }).catch(err=>console.log(err.response))
    },[])
    const onChangeHandler=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
      }
    const ApplyAll=(day)=>{
        days.map((d)=>{
            console.log(d)
            if(d!=day)
            for(let x in state[day]){
                state[day][x].map((slot)=>{
                    
   
                    axios.post(LIVE_URL+'api/slot/add_by_day',{session:slot.session,startTime:slot.startTime,endTime:slot.endTime,day:d},{withCredentials:true}).then((res)=>{
                        // let dy=state[day]
                        // dy.push({data})
                        // console.log(dy)
                        // setState({...state,[day]:dy})
                        console.log(res.data)
                     }).catch(err=>console.log(err.response))
                })
            }
        })
    
        
    }
    const Delete=(_id,session,day)=>{
        axios.post(LIVE_URL+'api/slot/delete_by_id',{_id:_id,day:day},{withCredentials:true}).then((res)=>{
            console.log(res.data)
            let chg=state[day][session]
            console.log(chg)
            chg=chg.filter((obj)=>{
                return obj._id!=_id
            })
            console.log(chg)
            setState({...state,[day]:{...state[day],[session]:chg}})
        }).catch(err=>console.log(err))
    }
    
    return (
        !state.changing?
        <div style={{overflow:"auto"}} className="p-3">
            <select name="applyDay" onChange={onChangeHandler}>
                <option value="">select day</option>
                <option value="monday">Monday</option>
                <option value="tuesday">tuesday</option>
                <option value="wednesday">wednesday</option>
                <option value="thrusday">thrusday</option>
                <option value="friday">friday</option>
                <option value="friday">saturday</option>
                <option value="friday">sunday</option>
            </select>
            <button onClick={()=>{ApplyAll(state.applyDay)}}>Apply all</button>
            <div id="slotTable" className="flex flex-col flex-wrap:wrap">
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Monday
                    </div>
                        <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.monday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"monday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                   
                    <div onClick={()=>setState({...state,show:true,day:"monday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Tuesday
                    </div>
                   
                    <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.tuesday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"tuesday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                    <div onClick={()=>setState({...state,show:true,day:"tuesday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Wednesday
                    </div>
                    <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.wednesday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"wednesday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                    <div onClick={()=>setState({...state,show:true,day:"wednesday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Thrusday
                    </div>
                    <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.thrusday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"thrusday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                    <div onClick={()=>setState({...state,show:true,day:"thrusday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Friday
                    </div>
                    <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.friday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"friday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                    <div onClick={()=>setState({...state,show:true,day:"friday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Saturday
                    </div>
                    <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.saturday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"saturday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                    <div onClick={()=>setState({...state,show:true,day:"sunday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
                <div id="row" className="flex flex-row items-center bg-white flex-wrap:wrap">
                    <div className="w-24 p-3">
                        Sunday
                    </div>
                    <div className="flex flex-col flex-wrap:wrap">
                        {
                            Object.entries(state.sunday).map(([key,value])=>{
                                
                                return<div  className="flex flex-row"><div>{key}</div><div style={{flexWrap:"wrap"}} className="flex flex-row flex-wrap: wrap">{ value.map((obj)=>{
                                    
                                    return <div  style={{width:"120px"}} className="flex flex-row justify-center m-2 ml-2 items-center p-1 bg-gray-200 ">
                                        <span style={{fontSize:"11px"}}>{obj?.startTime}-{obj?.endTime}</span>
                                        <img src={pencil} style={{width:"12px"}} className="ml-2" />
                                        <img onClick={()=>Delete(obj._id,obj.session,"monday")} src={close} style={{width:"12px"}} className="ml-1"/>
                                       </div>
                                })}</div></div>
                            })
                        }
                        </div>
                    <div onClick={()=>setState({...state,show:true,day:"sunday"})} className="text-xl mr-2 ml-2">+</div>
                </div>
            </div>
            {state.show?<Add state={state} setState={setState} day={state.day}/>:null}
        </div>:"loading..."
    )
}
