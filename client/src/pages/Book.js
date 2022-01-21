import React,{useContext, useEffect, useState} from 'react'
import {bookContext} from '../Context/BookContext'
import axios from 'axios'
import {LIVE_URL} from '../utils/url'

async function pay(state,setState,detailes){
    let order_id,serviceName;
    setState({...state,disable:true})
    await axios.post(LIVE_URL+'api/pay/get_orderId',{serviceId:state.sService,sId:state.sSlot._id,date:state.date,name:detailes.sName,email:detailes.sEmail,phone:detailes.sPhone}).then((res)=>{
        order_id=res.data.order_id
        serviceName=res.data.serviceName
    }).then(()=>{
        var options = {
            "key": "rzp_test_JKeEnNSDHaPfk5", // Enter the Key ID generated from the Dashboard
            "currency": "INR",
            "name": serviceName||"service",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order_id, 
            "handler": function (response){
                window.location.href="/Thankyou/"+order_id
            },
            "prefill": {
                "name": detailes.sName,
                "email": detailes.sEmail,
                "contact": detailes.sPhone
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": { 
                "color": "#3399cc"
            },"modal": {
                "ondismiss": function(){   
                    setState({...state,disable:false})                                         // deleting Booked slot if someone close razorpay payment portal
                    axios.post(LIVE_URL+'api/slot/delete_booked',{
                        serviceId:state.sService,
                        slotId:state.sSlot._id,
                        date:state.date
                    }).then((res)=>{
                        console.log(res.data)
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            }
        };
        console.log(options)
        var rzp1 = new window.Razorpay(options);
        
        rzp1.on('payment.failed', function (response){
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
        });
        rzp1.open()
    }).catch(err=>{
        alert("error occurred")
        axios.post(LIVE_URL+'api/slot/delete_booked',{
            serviceId:state.sService,
            slotId:state.sSlot._id,
            date:state.date
        }).then((res)=>{
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
        window.location.reload()
    })
    
}

export default function Book() {
    const {book,dispatch}=useContext(bookContext)
    const [state,setState]=useState({
        sName:"",
        sEmail:"",
        sPhone:"",
        serviceName:"",
        charge:""
        
    })
    useEffect(()=>{
        if(!book.sService){
            window.location.href="/"
        }
        axios.post(LIVE_URL+'api/service/get_by_id',{
            _id:book.sService
        }).then((res)=>{
            setState({...state,serviceName:res.data.name,charge:res.data.charge})
        }).catch(err=>{
            console.log(err)})
        
    },[])
    const onChangeHandler=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
    }
    return (
        <div className="grid" style={{padding:"20px"}}>
            
            <form onSubmit={(e)=>{
                e.preventDefault()
                pay(book,dispatch,state)}} className="card" style={{margin:"5px",width:"100%",backgroundColor:"white",minHeight:"20px"}}>
                <div style={{width:"100%",padding:"5px",border:"solid #cecece 1px",position:"relative"}}>
                    <div style={{top:"-12px",left:"20px",position:"absolute",backgroundColor:"white",fontSize:"15px",color:"#757575",padding:"5px"}}>Name</div>
                    <input required={true} name="sName" onChange={onChangeHandler} style={{height:"40px",width:"100%",border:"none",outline:"none"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <div style={{width:"49%",padding:"5px",border:"solid #cecece 1px",position:"relative",borderRadius:"5px",marginTop:"30px"}}>
                        <div style={{top:"-12px",left:"20px",position:"absolute",backgroundColor:"white",fontSize:"15px",color:"#757575",padding:"5px"}}>Email</div>
                        <input required={true} name="sEmail" onChange={onChangeHandler} type="email" style={{height:"40px",width:"100%",border:"none",outline:"none"}}/>
                    </div>
                    <div style={{width:"49%",padding:"5px",border:"solid #cecece 1px",position:"relative",borderRadius:"5px",marginTop:"30px"}}>
                        <div style={{top:"-12px",left:"20px",position:"absolute",backgroundColor:"white",fontSize:"15px",color:"#757575",padding:"5px"}}>Phone</div>
                        <input type="tel" pattern="[1-9]{1}[0-9]{9}" placeholder={"10 digit mobile number"} required={true} name="sPhone" onChange={onChangeHandler} style={{height:"40px",width:"100%",border:"none",outline:"none"}}/>
                    </div>
                </div>
                <button type="submit" disabled={state.disable} className="butt" style={{marginTop:"30px",marginBottom:"30px",marginRight:"5%"}}>
                    Checkout
                </button>
            </form>
            <div id="bookSum" className="card" style={{padding:"0px",overflow:"hidden",height:'95%'}}>
                <div style={{padding:"15px",fontWeight:"500",borderBottom:"solid #cecece 1px"}}>
                    Booking Summary
                </div>
                <div style={{padding:"10px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"15px",marginTop:"20px"}}>
                        <div style={{textTransform:"capitalize",fontWeight:"300"}}>Date</div>
                        <div style={{textTransform:"capitalize",color:"#757575"}}>11-11-2021</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"15px",marginTop:"12px"}}>
                        <div style={{textTransform:"capitalize",fontWeight:"300"}}>Slot</div>
                        <div style={{textTransform:"capitalize",color:"#757575"}}>{book.sSlot?.startTime} - {book.sSlot?.endTime} {book.sSlot?.session?.name}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginTop:"12px"}}>
                        <div style={{textTransform:"capitalize",fontWeight:"300",}}>Test Service</div>
                        <div style={{textTransform:"capitalize",color:"#757575"}}>{state.serviceName}</div>
                    </div>
                    <div style={{height:"1px",width:"100%",backgroundColor:"#cecece",marginTop:"30px"}}></div>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"5px",marginTop:"10px"}}>
                        <div style={{textTransform:"capitalize",fontWeight:"300"}}>Total</div>
                        <div style={{textTransform:"capitalize",color:"#757575"}}>{state.charge}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
