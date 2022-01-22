import React,{useState,useEffect} from 'react'
import axios from 'axios'
import Close from '../assets/close.svg'
import Pen from '../assets/draw.svg'
import {LIVE_URL} from '../util/url'

const initState={
    sessions:[],
    name:"",
    showEdit:false,
    _id:""
}

const Edit=({name,_id,state,setState})=>{
    const [edit,setEdit]=useState({name:name,_id:_id})
    const onSubmit=(e)=>{
        e.preventDefault()
        axios.post(LIVE_URL+'api/session/update_by_id',{
            _id:_id,
            name:edit.name
        },{withCredentials:true}).then(()=>{
            let chg=state.sessions
            chg=chg.map((obj)=>{
                if(obj._id==_id)
                    obj.name=edit.name
                return obj
            })
            setState({...state,sessions:chg,showEdit:false})
        }).catch(err=>console.log(err.response))
    }
    const onChangeHandler=(e)=>{
        setEdit({...edit,[e.target.name]:e.target.value})
    }
    return <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-40 flex items-center justify-center ">
        <div onClick={()=>setState({...state,showEdit:false})} style={{zIndex:"0"}}className="absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-40 "></div>
        <div style={{zIndex:"1"}} className="bg-white p-2 rounded-md">
            <form onSubmit={onSubmit} className="flex flex-col">
                <input className="p-1 mb-2 rounded-md" name="name" value={edit.name} onChange={onChangeHandler}/>
                <button type="submit" className="w-full p-1 bg-blue-500 text-white rounded-md">Update</button>
            </form>
        </div>
    </div>
}

export default function ManageSession() {
    const [state,setState]=useState(initState)
    useEffect(()=>{ 
        axios.get(LIVE_URL+'api/session/get_all',{withCredentials:true}).then((res)=>{
            setState({...state,...res.data})
        }).catch(err=>console.log(err))
       
    },[])
    const onSubmit=(e)=>{
        e.preventDefault()
        axios.post(LIVE_URL+'api/session/add_session',{name:state.name},{withCredentials:true}).then((res)=>{
            let sessions=state.sessions
            sessions.push({name:state.name})
            setState({...state,sessions:sessions,name:""})
        }).catch(err=>{
            console.log(err)
        })
    }
    const Delete=(name)=>{
        axios.post(LIVE_URL+'api/session/delete_session',{
            name:name
        },{withCredentials:true}).then((res)=>{
            let chg=state.sessions
            chg=chg.filter((obj)=>{
                return obj.name!=name
            })
            setState({...state,sessions:chg})
        }).catch(err=>{
            console.log(err.response)
        })
    }
    
    const onChangeHandler=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
      }
    return (
        <div className="p-3 w-full">
            <div className="flex flex-row flex-wrap:wrap">
                {
                    state.sessions.map(obj=>{
                        return <div className="m-3 flex flex-row ">
                            {obj.name}
                            <div className="ml-1 flex flex-row ">
                                <img onClick={()=>{
                                    setState({...state,ename:obj.name,_id:obj._id,showEdit:true})
                                }} src={Pen} style={{width:"14px"}} className="mr-1"/>
                                <img onClick={()=>{Delete(obj.name)}} src={Close} style={{width:"14px"}}/>
                            </div>
                        </div>
                    })
                }
            </div>
            <form onSubmit={onSubmit} style={{width:"250px"}} className="flex flex-col">
                <input className="p-1 mb-2 rounded-md" name="name" value={state.name} onChange={onChangeHandler}/>
                <button  style={{color:"white"}} type="submit" className="w-full p-1 bg-blue-500 text-white rounded-md">Add</button>
            </form>
            {state.showEdit?<Edit name={state.ename} _id={state._id} state={state} setState={setState} />:null}
        </div>
    )
}
