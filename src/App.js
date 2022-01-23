import './App.css';
import {useState,useEffect} from 'react'
import {BrowserRouter as Router,Redirect,Route,Switch} from 'react-router-dom'
import './global.css'
import {authContext,AuthProvider} from './Context/AuthContext'
import {useContext} from 'react'
import Sidebar from './Components/Sidebar'
import axios from 'axios'
import PaymentDetailes from './Pages/PaymentDetailes'
import dotenv from 'dotenv'
import {LIVE_URL} from './util/url'
import Header from './Components/Header'
import Report from './Pages/Report';
import {uploadFile} from './util/upload'
import swal from 'sweetalert'
import Articles from './Components/Articles'
import AddSlots from './Pages/AddSlots'
import ManageServices from './Pages/ManageServices'
import ManageSession from './Pages/ManageSession'

dotenv.config()

const initState={
  email:"",
  password:"",
  forgot:false,
  register:false
}
function Register({handleBack}){
  const {state,dispatch}=useContext(authContext)
  const [stateLogin,setState]=useState(initState)
  const onSubmit=async (e)=>{
      e.preventDefault()
    
      if(stateLogin.password!==stateLogin.confirmPassword)
        return 
      let url =  await uploadFile(stateLogin['profile'].profilefile)
      let proof = await uploadFile(stateLogin['proof'].prooffile)
      console.log("proofUrl",proof)
      axios.post(LIVE_URL+'api/doctor/addDoctor',{
        name:stateLogin.name,
        description:stateLogin.Description,
        qualification:stateLogin.qualification,
        proof:proof,
        profile:url,
        zipcode:stateLogin.zipcode,
        password:stateLogin.password,
        email:stateLogin.email
      }).then((res)=>{
        handleBack()
      //   swal({
      //     text:res.data.message,
      //     icon:"success"
      // }).then(()=>{
      //     handleBack()
      //    })
        //  setState({...state,forgot:true})
      }).catch(err=>{ 
        console.log(err)
        // Swal.fire({
        //   text:err?.response?.data?.message,
        //   icon:"error"
        // })
      })

      
  }
  const onChangeHandlerFile=(e)=>{
    if(!e.target.files[0])
      return
    const obj = stateLogin[e.target.name]||{}
    obj[e.target.name+"url"]=URL.createObjectURL(e.target.files[0])
    obj[e.target.name+"file"]=e.target.files[0]
    setState({...stateLogin,[e.target.name]:obj})
 }
  const onChangeHandler=(e)=>{
    setState({...stateLogin,[e.target.name]:e.target.value})
  }
  return(
    <div className="flex flex-col items-center bg-white w-screen h-screen">
        
          <h1 style={{fontSize:"20px",textAlign:'center',borderBottom:"solid #f1f1f1 1px",width:"60%",marginTop:"5%",marginBottom:"20px"}} className="pb-4">Register</h1>
       
       
        <form onSubmit={onSubmit} style={{width:"300px",display:'flex',flexDirection:"column",alignItems:"center"}}>
           <label className="block rounded-full bg-cover bg-center w-profile h-profile bg-gray-200" style={{backgroundImage:`url(${stateLogin['profile']?.profileurl})`}}>
              <input name="profile" onChange={onChangeHandlerFile} hidden type="file" />
           </label>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="name" placeholder="Name" required={true} onChange={onChangeHandler} value={stateLogin.name}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
            </div>
            <div></div>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="email" type="email" placeholder="Email" required={true} onChange={onChangeHandler} value={stateLogin.email}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
            </div>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="Description" type="Description" placeholder="Description" required={true} onChange={onChangeHandler} value={stateLogin.Description}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
            </div>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="zipcode" pattern="[0-9]{5,}" placeholder="zipcode" required={true} onChange={onChangeHandler} value={stateLogin.zipcode}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
            </div>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="qualification" list="qualification" type="qualification" placeholder="Specialization" required={true} onChange={onChangeHandler} value={stateLogin.qualification}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
                <datalist id="qualification">
                    {/*all qualifications of doctor */}

                </datalist>
            </div>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="phone" pattern="[7-9]{1}[0-9]{9}" placeholder={"10 digit mobile number"} required={true} onChange={onChangeHandler} value={stateLogin.phone}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
            </div>
            
           <div className="m-2 flex flex-row pl-1 w-full h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
              {/* <img src={PadLock} width="22px" className="mr-1"/> */}
                <input name="password" placeholder="Password" type="password" required={true} value={stateLogin.password} onChange={onChangeHandler} className=" h-11 w-full bg-transparent"  style={{outline:"none"}}/>
            </div>
            <div></div>
            <div className="m-2 flex flex-row pl-1 w-full h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
              {/* <img src={PadLock} width="22px" className="mr-1"/> */}
                <input name="confirmPassword" placeholder="Confirm Password" type="password" required={true} value={stateLogin.confirmPassword} onChange={onChangeHandler} className=" h-11 w-full bg-transparent"  style={{outline:"none"}}/>
            </div>
             <div className='m-2 mr-4 w-full'>
               <label>Proof</label>
             </div>
              
              {/* <img src={PadLock} width="22px" className="mr-1"/> */}
                <input name="proof"  type="file" required={true}  onChange={onChangeHandlerFile} className=" h-11 w-full bg-transparent"  style={{outline:"none"}}/>
        
            <button type="submit" className="w-48 p-2 bg-gray-500 text-white m-2 mt-4">
              {"Submit"}
            </button>
            <button className="mt-6" onClick={handleBack}>
              Back to Login?
        </button>
            {/* <div className="mt-2">Forgot Password?</div> */}
        </form>
      
    </div>
  )
}
function Login(){
  const {state,dispatch}=useContext(authContext)
  const [stateLogin,setState]=useState(initState)
  const onSubmit=(e)=>{
    e.preventDefault();
    if(stateLogin.forgot){
      axios.post(LIVE_URL+'api/admin/forgotPassword',{
        email:stateLogin.email
      }).then((res)=>{
         swal(res.data.message,{
           icon:'success'
         })
         setState({...state,forgot:true})
      }).catch(err=>{alert(err?.response?.data?.message)})

      return
    }
    axios.post(LIVE_URL+'api/admin/login',{
      email:stateLogin.email,
      password:stateLogin.password
    },{withCredentials: true}).then((res)=>{
      // alert(res.data.message)
      dispatch({type:"LOG_IN"})
    }).catch(err=>{alert(err?.response?.data?.message)})
  }
  const onChangeHandler=(e)=>{
    setState({...stateLogin,[e.target.name]:e.target.value})
  }
  const handleBack=()=>{
    setState({...stateLogin,register:false})
  }
  return(stateLogin.register?
    <Register handleBack={handleBack} />
    :
    <div className="flex flex-col items-center bg-white w-screen h-screen">
        
          <h1 style={{fontSize:"20px",textAlign:'center',width:"60%",marginTop:"10%",marginBottom:"50px"}} className="pb-4">
            Doctor Login
          </h1>
       
       
        <form onSubmit={onSubmit} style={{width:"300px",display:'flex',flexDirection:"column",alignItems:"center"}}>
            <div className="w-full m-2 pl-1 flex flex-row items-center h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
                {/* <img src={Email} width="22px" className="mr-1"/> */}
                <input name="email" placeholder="Email" required={true} onChange={onChangeHandler} value={stateLogin.email}  className=" h-11 w-full bg-transparent" style={{outline:"none"}}/>
            </div>
            <div></div>
            {!stateLogin.forgot?<div className="m-2 flex flex-row pl-1 w-full h-auto bg-white rounded-md" style={{border:"solid #757575 1px"}}>
              {/* <img src={PadLock} width="22px" className="mr-1"/> */}
                <input name="password" placeholder="Password" type="password" required={true} value={stateLogin.password} onChange={onChangeHandler} className=" h-11 w-full bg-transparent"  style={{outline:"none"}}/>
            </div>:null}
            <div></div>
            <button type="submit" className="w-48 p-2 bg-gray-500 text-white m-2 mt-4">
              {stateLogin.forgot?"Send Link":"Submit"}
            </button>
            
            {/* <div className="mt-2">Forgot Password?</div> */}
        </form>
        <button className="mt-6" onClick={()=>setState({...stateLogin,register:true})}>
              Register?
        </button>
        
    </div>
  )
}

function MainApp(){
  const {state,dispatch}=useContext(authContext)
  console.log(state)
  useEffect(()=>{
    console.log(process.env.NODE_ENV)
    axios.get(LIVE_URL+'api/admin/check_login',{withCredentials: true}).then(()=>{
      dispatch({type:"LOG_IN"})
    }).catch(err=>dispatch({type:"LOG_OUT"}))
  },[])
  return (
   !state?.loggedIn
      ?<Login />:
      <Router>
        <Header/>
        <div style={{overflowX:"hidden"}} className="bg-white m-0 p-0 w-full h-full flex flex-row">
          <Sidebar/>
          <Switch>
            <Route exact path="/pay">
              <PaymentDetailes/>
            </Route>
            <Route exact path="/reports">
              <Report/>
            </Route>
            <Route exact path="/articles">
              <Articles/>
            </Route>
            <Route exact path="/ManageSlots">
              <AddSlots/>
            </Route>
            <Route exact path="/ManageSession">
              <ManageSession/>
            </Route>
            <Route exact path="/ManageServices">
              <ManageServices/>
            </Route>
          </Switch>
        </div>
      </Router>
    
   
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp/>
    </AuthProvider>
   
  );
}

export default App;
