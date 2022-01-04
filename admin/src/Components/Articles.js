import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { LIVE_URL } from '../util/url'
import Swal from 'sweetalert2'
import {uploadFile} from '../util/upload'
import {BiPencil} from 'react-icons/bi'
import {AiOutlineClose} from 'react-icons/ai'

let form = new FormData()
const AddArticle=({handleClose,refresh})=>{
    const [edit,setEdit]=React.useState({
        text:"",
        pic:{},
        title:""
    })
    
    const onSubmit=async (e)=>{
        e.preventDefault()
        // if(state.edit){
        //     axios.post(LIVE_URL+'api/team/editTeam',form,{withCredentials:true}).then((res)=>{
        //         Swal.fire({
        //             text:res.data.message,
        //             icon:"success"
        //         })
        //         handleClose()
        //         refresh()
        //     }).catch(err=> Swal.fire({
        //         text:err.response?.data.message||"Something Went Wrong",
        //         icon:"error"
        //     }))
        //     return
        // }
        
        let pic = await uploadFile(edit['pic'])
        console.log("PIC",pic)
        axios.post(LIVE_URL+'api/article/addArticle',{pic:pic ,title:edit.title, text:edit.text},{withCredentials:true}).then((res)=>{
            
            Swal.fire({
                text:res.data.message,
                icon:"success"
            })
            handleClose()
            refresh()
        }).catch(err=> Swal.fire({
            text:err.response?.data.message||"Something Went Wrong",
            icon:"error"
        }))
        form=new FormData()
    }
    const onChangeHandlerFile = (e) => {
        
        setEdit({...edit,[e.target.name]:e.target.files[0]})
      };
    const onChangeHandler=(e)=>{
        setEdit({...edit,[e.target.name]:e.target.value})
        form.set(e.target.name,e.target.value)
    }
   
   
    return <div style={{zIndex:10}} className="absolute top-14 bottom-0 right-0 left-0 flex  justify-center">
        <div style={{zIndex:0,backgroundColor:"rgba(0,0,0,0.6)"}}className="fixed top-0 bottom-0 right-0 left-0 "></div>
        <div  style={{zIndex:1,border:"solid #f1f1f1 1px",width:"40%",height:"fit-content",boxShadow:"0px 0px 10px rgba(0,0,0,0.2)",overflow:"auto"}} className="bg-white scale-in pb-2 pt-0  flex flex-col">
            <div className="w-full p-2 bg-gray-200 flex  flex-row justify-between">
                Add Team
                <img src="close.svg" onClick={handleClose} style={{width:"11px"}} />
            </div>
            <form onSubmit={onSubmit} className="flex flex-col p-2 items-center justify-around m-4">
               
                
                <input type="file" className="mb-4" onChange={onChangeHandlerFile} name="pic" />
                <input required={true} className="p-1 mb-4 w-52" placeholder="Title" value={edit.name} style={{border:"solid gray 1px",paddingLeft:"4px"}} name="title"   onChange={onChangeHandler}/>
                <textarea required={true} className="p-1 mb-4 w-52" placeholder="Text" value={edit.name} style={{border:"solid gray 1px",paddingLeft:"4px"}} name="text"  onChange={onChangeHandler}/>
                <button type="submit"  className="text-white p-1 bg-gray-500 m-auto  w-48 mt-3 mb-2">Submit</button>
               
            </form>
        </div>
    </div>
}


export default function Articles() {
    const [state,setState] = useState({articles:[],open:false,refresh:0})
    useEffect(()=>{
        axios.get(LIVE_URL+"api/article/getAllAdmin",{withCredentials:true}).then((res)=>{
            setState({...state,articles:res.data.articles})
        }).catch((err)=>console.log(err))
    },[state.refresh])
    const onChangeHandler = (e) =>{
        setState({...state,[e.target.name]:e.target.value})
    }
    const handleClose=()=>{
        setState({...state,open:false})
    }
    const refresh=()=>{
        setState({...state,refresh:state.refresh+1,open:false})
    }
    const onChangeHandlerFile=(e,index)=>{
        if(!e.target.files[0])
          return
        let stateLogin = state[index]||{}
        const obj = stateLogin[e.target.name]||{}
        obj[e.target.name+"url"]=URL.createObjectURL(e.target.files[0])
        obj[e.target.name+"file"]=e.target.files[0]
        setState({...state,[index]:{[e.target.name]:obj}})
     }
    const onDelete = (id) =>{
        axios.delete(LIVE_URL+"api/article/deleteArticle/"+id).then((res)=>{
            refresh()
        }).catch((err)=>Swal.fire({
            text:err.response?.data.message||"Something Went Wrong",
            icon:"error"
        }))
    }
    return (
        <div className="w-full">
            <div className="w-full p-4 cursor-pointer flex flex-row items-center justify-between block  border-b-0 border  border-gray-200 text-grey-100 font-sm bg-gray-200">
                <div>Manage Article</div>
               <div onClick={()=>setState({...state,open:true})}>
                    Add Article
               </div>
            </div>
            <div className="flex flex-wrap">
            {
                state.articles.map((data,index)=>{
                    console.log(data)
                    return <div className="article relative">
                        <img src={state[index]?.pic?.picurl||data.pic} style={{width:"100%",height:"auto"}}>
                           
                        </img>
                        
                        <div className="m-2 mb-1 text-lg  capitalize" style={{fontSize:"19px",fontWeight:"600"}}>
                           {data.title}
                        </div>
                        <div style={{margin:"8px",fontSize:"15px"}}>
                            {data.text}
                        </div>
                        <label className="bg-gray-100 bg-opacity-50 absolute top-0 left-0 text-white rounded-full p-1 text-xl">
                            <BiPencil />
                            <input hidden type="file" onChange={(e)=>onChangeHandlerFile(e,index)} name="pic"/>
                        </label>
                        <label className="bg-gray-100 bg-opacity-50 absolute top-0 right-0 text-white rounded-full p-1 text-xl">
                            <AiOutlineClose onClick={()=>onDelete(data._id)}/>
                            
                        </label>
                    </div>
                })
            }
            </div>
            
            {state.open&&<AddArticle handleClose={handleClose} refresh={refresh}/>}
        </div>
    )
}
