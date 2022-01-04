import React from 'react'
import { useEffect,useState, useContext } from 'react'
import axios from 'axios'
import {LIVE_URL} from '../utils/url'
import {bookContext} from '../Context/BookContext'
import './Home.css'
import { useHistory } from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"


export default function Home() {
    const history = useHistory()
    const [state,setState] = useState({qualifications:[],doctors:[],articles:[]})
    const {book,dispatch} = useContext(bookContext)
    function getDoctor(e){
        e.preventDefault()
        axios.get(LIVE_URL+'api/doctor/findByZipCode/'+state.zipcode+'/'+state.profession).then(res=>{
            setState({...state,doctors:res.data.doctors})
        }).catch(err=>console.log(err))
    }
    const requests = async ()=>{
        let qualifications,articles;
        await axios.get(LIVE_URL+'api/doctor/getList').then((res)=>{
            qualifications=res.data.qualifications
        }).catch(err=>{console.log("Something Went Wrong")})

        await axios.get(LIVE_URL+'api/article/getAll').then((res)=>{
            articles=res.data.articles
        }).catch(err=>{console.log("Something Went Wrong")})
        setState({...state,qualifications,articles})
    }
    useEffect(()=>{
       requests()
    },[])
    const addDocId=(id)=>{
        dispatch({type:"SET",payload:{docid:id}})
        history.push('/booking')
    }
    const onChangeHandler=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
    }
    return (
        <div >
            {/*Seach Bar */}
            <form onSubmit={getDoctor} className="search-bar" style={{marginTop:"10px"}}>
                <div className="appointment-form flex flex-row items-center " style={{margin:"auto"}}>
                    
                    <div className="input" >
                        <i class="fa fa-search " aria-hidden="true"></i>
                            <input id='profession' type='text' placeholder='qualification' name='profession'
                            list='docdata' 
                            className="borderless-input"
                            onChange={onChangeHandler}
                            required
                            autoComplete="off"
                            />
                            <datalist id='docdata'>
                                {
                                    state?.qualifications.map((obj)=>{
                                        //console.log(obj)
                                        return <option>{obj}</option>
                                    })
                                }
                            </datalist>
                    </div>
                    <div className="division"/>
                    <div className="input width-need ">
                        <i class="fa fa-map-marker " aria-hidden="true"></i>
                        <input name="zipcode" required id='location-id' placeholder='zip code' onChange={onChangeHandler} className="borderless-input" type='text'/>
                    </div>
                    
                    <div className="division"/>
                    <div >
                        <button type='submit' style={{margin:"0px"}} className="borderless-input" style={{backgroundColor:"white"}}><i class="fa fa-search " style={{fontSize:"20px",fontWeight:"400"}} aria-hidden="true"></i></button>
                    </div>
                </div>
            </form>

            {/*Doctors */}
            <div className="doctors">
                {
                    state.doctors.map((obj)=>{
                        return (
                            <div className="doctor-card" onClick={()=>addDocId(obj._id)}>
                                <div className="flex flex-row items-center w-100" style={{justifyContent:"space-between"}}>
                                    <div style={{backgroundImage:`url(${obj.profilePic}})`,width:"70px",height:"70px",borderRadius:"50%",backgroundPosition:"center center",backgroundSize:"cover"}}>

                                    </div>
                                    <div style={{width:"265px"}}>
                                        <p className="doctor-name">{obj.name}</p>
                                        <p className="doctor-post">{obj.post}</p>
                                        <p className="doctor-post">{obj.zipcode}</p>
                                    </div>
                                </div>
                                <p className="doctor-des">
                                    {obj.description}
                                </p>
                                <div class="flex flex-row items-center" style={{justifyContent:"space-between"}}>
                                    <p className="view">View Upcoming availability </p>
                                    <i class="fa fa-chevron-right"></i>
                                </div>
                            </div>
                        )
                    })
                }
                

            </div>

            {/*Articles*/}
            <ResponsiveMasonry style={{width:'90%',margin:"auto"}} columnsCountBreakPoints={{350: 1, 750: 2, 900: 3,1100:4}}>
                <Masonry>
                {
                state.articles.map((data,index)=>{
                   
                    return <div className="article relative">
                        <img src={state[index]?.pic?.picurl||data.pic} style={{width:"100%",height:"auto"}}>
                           
                        </img>
                        <div className="article-text">
                            <div style={{fontSize:"19px",fontWeight:"600",margin:"8px",marginBottom:"4px"}}>
                            {data.title}
                            </div>
                            <div style={{margin:"8px",fontSize:"15px"}}>
                                {data.text}
                            </div>
                        </div>
                        
                    </div>
                })
            }
                </Masonry>
            </ResponsiveMasonry>
            
            </div>
     
    )
}
