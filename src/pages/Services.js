import React,{useEffect, useState,useContext} from 'react'
import axios from 'axios'
import Calender from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import {bookContext} from '../Context/BookContext'
import {Link,useHistory} from 'react-router-dom'
import {LIVE_URL} from '../utils/url'
import Right from './right.png'
import {Slide, Zoom} from 'react-reveal'

var current = new Date()
var currTime= `${current.getHours()}`.padStart(2,'0')+':'+`${current.getMinutes()}`.padStart(2,'0')
var d = String(current.getDate()).padStart(2, '0');
var m = String(current.getMonth() + 1).padStart(2, '0'); //January is 0!
var y = current.getFullYear();
var currDate =  y + '-' + m + '-' +d;

const tillImage=7

let numDatMapping={
    "0":"sunday",
    "1":"monday",
    "2":"tuesday",
    "3":"wednesday",
    "4":"thrusday",
    "5":"friday",
    "6":"saturday"
}

export default function Services() {
    const history = useHistory()
    const {book,dispatch}=useContext(bookContext)
    const [state,setState]=useState({
        services:[],
        sService:"",
        date:"",
        sDay:"",
        week:{},
        sSlot:"",
        loading:true,
        sName:"",
        sEmail:"",
        sPhone:"",
        sCharge:"",
        bookedSlots:[],
        loadingWeeks:false,
        SelectedService:{},
        activeServices:0
    })
    useEffect(()=>{
        var dat = new Date();
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today =  yyyy + '-' + mm + '-' +dd;
        dat=dat.getDay()
        if(!book.docid)
            history.push('/')
        axios.get(LIVE_URL+'api/service/get_by_doc_id/'+book.docid).then((res)=>{
                axios.get(LIVE_URL+"api/slot/get_booked_client/"+book.docid).then(res3=>{
                    if(state.date==="")
                        setState({...state,...res.data,loading:false,bookedSlots:res3.data,date:today,sDay:numDatMapping[dat],activeServices:res.data.activeServices})
                    else
                        setState({...state,...res.data,loading:false,bookedSlots:res3.data,activeServices:res.data.activeServices})
                }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    },[])
    const onChangeHandler=(e)=>{
        const d=new Date(e.target.value)
        const day=d.getDay()
        setState({...state,[e.target.name]:e.target.value,sDay:numDatMapping[day]})
    }
    const onChange=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
    }
    const selectSlot=(obj)=>{
        if(containsObject({serviceId:state.sService,slotId:obj?._id,date:state.date},state.bookedSlots))
            return
       
        setState({...state,sSlot:obj})
    }
    const onSubmit=()=>{
        //e.preventDefault()
        dispatch({type:"SET",payload:state})
    }
    const check=(val)=>{
        var dat = new Date(val);
        var today = new Date(val);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today =  yyyy + '-' + mm + '-' +dd;
        dat=dat.getDay()
        console.log(state)
        setState({...state,date:today,sDay:numDatMapping[dat]})
        if(state.sService==="")
            alert("Please select a service to proceed with the booking!")
    }
    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            
            if (list[i].serviceId === obj.serviceId&&((list[i].slotDetailes.endTime===obj.endTime&&list[i].slotDetailes.startTime===obj.startTime))&&list[i].slotDetailes.day === obj.day&&obj.date===list[i].date) {
                
                return true;
            }
            if(obj.startTime<currTime&&obj.date<=currDate)
                return true
        }
        return false;
    }
    function dec(t1){
        let a=t1.split(':')
        let b=t1.split(':')
        if(a[0]>'12')
        a[0]=parseInt(a[0])-12
        return `${a[0]}`.padStart(2,'0')+':'+a[1]
    }
    function get_week(obj){
        setState({...state,week:{},sService:obj._id,loadingWeeks:true,SelectedService:obj,sSlot:""})
        axios.post(LIVE_URL+"api/slot/get_week",{serviceId:obj._id},{withCredentials:true}).then((res)=>{
            setState({...state,week:res.data,sService:obj._id,loadingWeeks:false,SelectedService:obj,sSlot:""})
        }).catch(err=>{
          
            setState({...state,week:{},loadingWeeks:false,sService:obj._id,SelectedService:obj})
        })
    }
    return (
        !state.loading&&state.week!=={}?
        <>
        <div id="mainHome" style={{display:"flex",flexDirection:"row",flexWrap:"wrap",marginBottom:"30px",marginTop:"20px",padding:"5px",alignItems:'center',height:"750px"}}>
            <div id="home1" style={{display:"flex",flexDirection:"column",marginRight:"12px",boxShadow:"0px 10px 10px rgba(0,0,0,0.2)",width:"27%",height:'100%',backgroundColor:'white'}}>
                <img src="https://labblog.uofmhealth.org/sites/lab/files/2018-06/michigan-med-l-doc-wardrobe.jpg" style={{width:"100%",hight:"auto"}}/>
                <div id="services" className="card" style={{borderRadius:"0px",overflowY:'auto',boxShadow:"none",height:"100%",padding:"0px",display:"flex",flexDirection:"column",width:"100%"}}>
                    <div style={{padding:"10px"}}>
                        Select a Service
                    </div>
                    {state.services.length==0&&<p style={{textAlign:"center"}}>No Services Found</p>}
                    {
                        state.services.map(obj=>{
                            if(obj.active)
                            return <Slide left><span onClick={async ()=>{
                                // setState({...state,sService:obj._id,SelectedService:obj})
                                get_week(obj)
                            
                                }} className="centerRow" style={{cursor:"pointer",width:"100%",color:"rgba(0, 0, 0, 0.6)",padding:"14px",paddingLeft:"20px",borderBottom:"solid gray 1px",paddingRight:"20px",backgroundColor:state.sService===obj._id?"rgba(30, 65, 89, 0.08)":"white",fontSize:"17px"}}>
                                    <img src={Right} style={{width:"24px",height:"18px",marginRight:'20px'}}/>
{obj.name}
                                </span></Slide>
                        })
                    }
                </div>
            </div>
            {/* <div style={{width:"90%",display:'flex',justifyContent:"flex-end"}}>
                <input type="date" name="date" style={{marginBottom:"30px"}} onChange={onChangeHandler}/>
            </div> */}
            
            {state.sService!==""?<Zoom><div id="home2" style={{display:"flex",boxShadow:"0px 10px 10px rgba(0,0,0,0.2)",flexDirection:"column",width:"71%",maxWidth:"71%",backgroundColor:"white",alignItems:"center",justifyContent:"space-between",padding:"10px",height:"100%",overflowY:"auto"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:"20px",height:"min-content",width:'100%'}}>
                    <Calender minDate={new Date()} onChange={check} value={new Date(state.date)} style={{border:"none",width:'100%'}}/>
                </div>
                {
                        state?.sDay!==""&&state.sDay&&state.sService!==""&&state.week[state.sDay]?
                        <div id="slots" style={{maxWidth:"100%",marginLeft:"5px",display:"flex",flexWrap:"wrap",justifyContent:"center"}}>
                
                    
                                {state.week[state.sDay].length>0?state.week[state.sDay].map((obj)=>{
                                        
                                        const b=containsObject({serviceId:state.sService,startTime:obj.startTime,endTime:obj.endTime,day:state.sDay,date:state.date},state.bookedSlots)                             
                                        return <div style={{cursor:"pointer",color:state.sSlot===obj&&!b?"white":"black",padding:"5px",paddingLeft:"10px",paddingRight:"10px",width:"135px",textAlign:'center',border:b?"solid #cecece 1px":"solid #1e4159 1px",backgroundColor:state.sSlot===obj&&!b?"#1e4159":"white",fontSize:"17px",position:"relative",margin:"5px",overflow:"hidden"}} onClick={()=>{
                                            selectSlot(b?"":obj)
                                            }} id="hovSlot" >
                                            <span style={{fontSize:"14px"}}>{obj.startTime<'12:00'?<>{obj?.startTime}-{obj?.endTime} AM</>:<>{dec(obj?.startTime)}-{dec(obj?.endTime)} PM</>}</span>
                                            {b?<div onClick={()=>{
                                                selectSlot("")}} style={{top:0,left:0,right:0,bottom:0,position:'absolute',backgroundColor:"rgba(255,255,255,0.5)",zIndex:"3"}}></div>:null}
                                        </div>
                                    
                                }):<p style={{textAlign:"center",width:"37vw"}}>No Slots for this day</p>}
                                    
                        
                </div>:state.loadingWeeks===true?<p style={{textAlign:"center",width:"37vw"}}>loading...</p>:<p style={{textAlign:"center",width:"37vw"}}>No Slots</p>
                    }
            
                <div style={{width:"100%",maxWidth:"100%",display:'flex',justifyContent:"flex-end"}}>
                    {state.sSlot!==""?<Link style={{marginRight:"5%"}} to="/payment"><button onClick={()=>onSubmit()} className="butt" style={{marginTop:"30px",marginBottom:"30px",width:"150px"}}>
                        <span>Proceed To Pay</span>
                    </button></Link>:null}
                </div>
            </div></Zoom>:<div id="home2" style={{display:'flex',flexWrap:"wrap",width:"70%",maxWidth:"71%",height:"auto",overflowY:'auto',alignItems:'center',justifyContent:'center'}}>
                    Please Select a Service to Procced!
                        
                </div>}
                
        </div></>:null
    )
}
