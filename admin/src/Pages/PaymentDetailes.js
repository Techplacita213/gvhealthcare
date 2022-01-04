import React,{useEffect, useState} from 'react'
import axios from 'axios'
import {LIVE_URL} from '../util/url'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import Close from '../assets/close.svg'
import swal from 'sweetalert';
import {useParams} from 'react-router-dom'

export default function PaymentDetailes() {
    const {name}=useParams()
    const [state,setState] = useState({
        bookedSlots:[],
        search:"",
        by:"",
        currentPage:1,
        pages:[],
        refresh:0,
        toSort:false,
        by:""
    })
    useEffect(()=>{
        axios.post(LIVE_URL+'api/slot/get_booked_paginate',{currentPage:state.currentPage,name:name}).then((res)=>{
            let arr=[]
            if(res.data.pageCount<5){
                for(let i=0;i<res.data.pageCount;i++){
                    arr.push(i+1)
                }
            }else{
                for(let i=0;i<5;i++){
                    arr.push(i+1)
                }
            }
            setState({...state,bookedSlots:res.data.bookedSlots,pageCount:res.data.pageCount,pages:arr})
        }).catch(err=>console.log(err))
    },[state.refresh])
    function pageClick(page){
        axios.post(LIVE_URL+'api/slot/get_booked_paginate',{currentPage:page,toSort:state.toSort,by:state.by,name:name}).then((res)=>{
            setState({...state,bookedSlots:res.data.bookedSlots,pageCount:res.data.pageCount,currentPage:page})
        }).catch(err=>console.log(err))
    }
    const refund=(amount,tid)=>{
        console.log(typeof(amount))
        swal({
            title: "Are You Sure?",
            text: `Refund Amount: ${amount}`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axios.post(LIVE_URL+'api/pay/refund',{tid:tid,amount:parseInt(amount)}).then((res)=>{
                    swal("Will be refunded!", {
                        icon: "success",
                      })
                    setState({...state,refresh:state.refresh+1})
                }).catch((err)=>swal(err.response.data.message,{
                    icon:"danger"
                }))
              ;
            } else {
             
            }
          });
       
    }
    
    const sort=(Name)=>{
        axios.post(LIVE_URL+'api/slot/get_booked_paginate',{currentPage:1,toSort:true,by:Name,name:name}).then((res)=>{
            let arr=[]
            if(res.data.pageCount<5){
                for(let i=0;i<res.data.pageCount;i++){
                    arr.push(i+1)
                }
            }else{
                for(let i=0;i<5;i++){
                    arr.push(i+1)
                }
            }
            setState({...state,bookedSlots:res.data.bookedSlots,pageCount:res.data.pageCount,pages:arr,currentPage:1,by:Name,toSort:true,search:""})
        }).catch(err=>console.log(err))
    }
    function changeProcessing(obj){
        if(obj.status==="processing"){
            axios.post(LIVE_URL+"api/slot/change_status",{status:"completed",id:obj._id}).then((res)=>{
                
                let book=state.bookedSlots

                book=book.map((ob)=>{
                    if(ob._id==obj._id){
                        if(ob.status==="processing"){
                            ob.status="completed" 
                        }else if(ob.status==="completed"){
                            ob.status="processing"
                        }
                    }
                    return ob
                })
                setState({...state,bookedSlots:book})
            }).catch(err=>{
                console.log(err)
            })
        }else if(obj.status==="completed"){
            axios.post(LIVE_URL+"api/slot/change_status",{status:"processing",id:obj._id}).then((res)=>{
                let book=state.bookedSlots

                book=book.map((ob)=>{
                    if(ob._id==obj._id){
                        if(ob.status==="processing"){
                            ob.status="completed" 
                        }else if(ob.status==="completed"){
                            ob.status="processing"
                        }
                    }
                    return ob
                })
                setState({...state,bookedSlots:book})
            }).catch(err=>{
                console.log(err)
            })
        }
    }
    return (
        <div className=" w-full" style={{overflowX:"auto"}}>
             
            <table id="alter" style={{width:"100%",backgroundColor:"white",overflowX:"auto"}}>
                
                   
                
                <tr>
                    <th className="bg-white" style={{width:"auto"}}>OrderId</th>
                    <th className="bg-white">Name</th>
                    <th  onClick={()=>sort('date')} className="cursor-pointer bg-white">Date</th>
                    <th className="bg-white">Slot</th>
                    <th className="bg-white">Service</th>
                    <th className="bg-white">Status</th>
                    <th className="bg-white">Cancel</th>
                </tr>
                {
                    state.bookedSlots.map(obj=>{
                        
                        return <tr>
                            <td>{obj.receipt}</td>
                            <td>{obj.userDetailes?.name}</td>
                            <td>{obj.date}</td>
                            <td><span>{obj?.slotDetailes?.startTime||"not"}-{obj?.slotDetailes?.endTime||"exists"}</span></td>
                            <td><span>{obj?.serviceId?.name||obj.serviceName}</span></td>
                            <td onDoubleClick={()=>{
                            changeProcessing(obj)
                            }}><span style={{padding:"5px",color:"white",fontSize:"13px",backgroundColor:obj.status==="processing"||obj.status==="completed"?"#10B981":"#EF4444"}}>{obj.status}</span></td>
                            <td onClick={()=>{refund(obj.amount*(100-2.18)/100||obj.serviceId.charge*(100-2.18)/100,obj.tid)}}><img src={Close} style={{width:"7px",height:"auto",margin:"auto"}}/></td>
                        </tr>
                    })
                }
            </table>
            <div style={{width:"min-content",margin:'auto',alignItems:'center',height:'auto',marginTop:"30px"}} className="flex flex-row items-center">
               
                <div style={{margin:"auto",width:"min-content",height:'auto'}} className="flex flex-row">
                    {
                        state.pages.map(page=>{
                            return <div onClick={()=>{
                                setState({...state,currentPage:page})
                                pageClick(page)
                            }} className={`p-1 pl-3 pr-3 cursor-pointer ml-2 mr-2 ${state.currentPage==page?"bg-gray-200 rounded-sm":""}`}>{page}</div>
                        })
                    }
                </div>
                
            </div>
        </div>
    )
}
