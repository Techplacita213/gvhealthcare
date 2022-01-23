import React,{useState} from 'react'
import axios from 'axios'
import {LIVE_URL} from '../util/url'

export default function Report() {
    const [state,setState]=useState({
        from:"",
        to:"",
        report:[]
    })
    const onChangeHandler=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
    }
    const onSubmit = (e)=>{
        e.preventDefault()
        axios.post(LIVE_URL+'api/slot/get_report_date',{from:state.from,to:state.to}).then((res)=>{
            setState({...state,report:res.data})
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="w-full h-screen">
           <div className="w-full p-4 cursor-pointer flex flex-row items-center justify-between block  border-b-0 border  border-gray-200 text-grey-100 font-sm bg-gray-200">
                <div>Fund Received Report</div>
            </div> 
            <div className="w-full p-4">
                <form onSubmit={onSubmit}>
                    <div className="flex flex-row">
                        <div className="w-full mb-2">
                                <label className="text-darkgray " style={{marginRight:"13px"}}>From</label>
                                <input onChange={onChangeHandler} required={true} className="p-2 mb-2 " value={state.op} type="date" style={{border:"solid gray 1px",paddingLeft:"4px"}} name="from" className="w-52"  />
                        </div>
                        <div className="w-full mb-2">
                                <label className="text-darkgray" style={{marginRight:"13px"}}>To</label>
                                <input onChange={onChangeHandler} required={true} className="p-2 mb-2 " value={state.op} type="date" style={{border:"solid gray 1px",paddingLeft:"4px"}} name="to" className="w-52"  />
                        </div>
                    </div>
                    <button type="submit"  className="text-white p-1 bg-gray-500 m-auto  w-48 mt-3 mb-2">Get Report</button>
                </form>
            </div>
            {state.report.length!==0&&
            <table id="alter" style={{width:"100%",backgroundColor:"white",overflowX:"auto"}}>
                <tr>
                    <th className="pb-2">
                        S.No.
                    </th >
                    <th className="pb-2">
                        Service Name
                    </th>
                    <th className="pb-2">
                        Fund Received
                    </th>
                </tr>
                {
                    state.report.map((obj,index)=>{
                        return <tr>
                            <td>{index+1}</td>
                            <td >{obj.ServiceName}</td>
                            <td>{obj.revenue}</td>
                        </tr>
                    })
                }
            </table>
            }           
        </div>
    )
}
