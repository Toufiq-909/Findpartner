import {useState} from 'react'
import {useEffect} from 'react'
import logo from '../../images/icons8-user-96.png'
import {create,approve,decline,finduser,move,dely} from './api/adminapi.js'
let token="";
token=new URLSearchParams(window.location.search)
token=token.get("token")
console.log(token)
function App()
{

    return (
        <div className={"transition-all duration-300"}>
            <div className={"flex justify-between ml-6 mr-12 pt-4"}>
                <Topbar />
                <Logoout />
            </div>
            <Sidebar />
        </div>
    )
}
function Sidebar()
{
    const [option,setoption]=useState("Events");
    const [events,setevent]=useState([]);
    const [category,setcategory]=useState("all");
    useEffect( ()=>{
        const fetchdata=async ()=>{
            if(option!="create"&&option!="view")
            {
                console.log(token)
                let res=await fetch("http://localhost:3000/adminportal/"+option,{
                    method:"GET",
                    headers:{
                        "token":token
                    }
                })
                console.log("got res")
                let response=await res.json();
                console.log(response)
                setevent(response)


            }
        }
        fetchdata()
    },[option])

    const removebyid=(id)=>{

        setevent(events.filter(x=>x._id!=id))

    }
    const changeevent=(x)=>{
        console.log(Object.getOwnPropertyNames(events.filter(y=>y._id===x))+"asdfasdf")

       setevent(events.filter(y=>y._id===x))

    }
    const changestate=(x)=>{
        setoption(x)
    }
    return (
        <div className={"flex"}>
            <div className={"inline-flex flex-col justify-evenly h-[500px] mt-6 ml-4 "}>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("Events")
                }}>
                    Dashboard

                </button>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("create")
                }}>
                    Add Event

                </button>
                <button className={"btn  font-[cookie] text-4xl"} onClick={() => {
                    setoption("completedevents")
                }}>
                    Finished

                </button>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("deletedevents")
                }}>
                    Archived

                </button>
                <button className={"btn  font-[cookie] text-4xl"} onClick={() => {
                    setoption("reqevent")
                }}>
                    Requests

                </button>
            </div>
            <div className={"flex flex-wrap justify-around  "}>
                {option!="create"  &&
                    events.map((x,index)=>{
                        return   <Eventcomponent image={x.image}
                                                 category={x.category}
                                                 date={x.date}
                                                 teamSize={x.teamSize}
                                                 text={x.text}
                                                 name={x.name}
                                                 user={x.user}
                                                 id={x._id}
                                                 op={option}
                                                 callme={removebyid}
                                                 view={changeevent}
                                                 cs={changestate}
                        />
                    })

                }
                {option === "create" &&<Create />


                }
                {
                    option==="view" &&<User
                    ev={events}
                    />
                }
            </div>


        </div>
    )
}

function Eventcomponent(props) {
    return (
        <div className={"mt-8 inline-flex flex-col w-[400px] h-[620px] justify-between card card-border transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"} id={props.id}>
            <img  className={"h-[300px] w-[90%] mt-4 ml-4 rounded-lg"} src={props.image}/>
            <p className={"card-title ml-4 "}>Category : {props.category}</p>
            <p className={"card-title ml-4 "}>Date : {props.date}</p>
            <p className={"card-title ml-4 "}>Team Size : {props.teamSize}</p>
            <p className={"card-title ml-4 "}>Description : {props.text}</p>
            <p className={"card-title ml-4 "}>Creator : {props.name}</p>
            <p className={"card-title ml-4 "}>Participants : {props.user}</p>
            {(props.op === "Events" )&&
                <div className={"flex justify-around mb-2 font-[cookie] "}>
                    <input type={"checkbox"} className={"checkbox"} onClick={
                       async (event)=>{
                            let ab=event.target.parentNode;
                            let a=await move(ab.parentNode.id,token)
                           console.log(a+"Stus");
                            window.location.reload()

                        }
                    }/>
                    <button className={"btn bg-blue-500 text-white text-2xl w-[38%] hover:bg-blue-600"} onClick={
                        (event)=>{
                            let ab=event.target.parentNode
                            props.view(ab.parentNode.id)
                            console.log(ab.parentNode.id+"id")
                            props.cs("view")
                        }
                    }>View</button>
                    <button className={"btn bg-rose-500 text-white text-2xl w-[38%] hover:bg-rose-600 "}
                            onClick={
                                async (event)=>{
                                    let ab=event.target.parentNode;
                                    let a=await dely(ab.parentNode.id,token)
                                    console.log(a+"Stus");
                                    window.location.reload()

                                }}
                    >delete</button>
                </div>

            }
            {props.op === "reqevent" &&
                <div className={"flex justify-around mb-2 font-[cookie] "}>
                    <button className={"btn bg-blue-500 text-white text-2xl hover:bg-blue-600"} onClick={async (event) => {
                        let ab = event.target.parentElement
                        let rstatus=await approve(ab.parentNode.id,token);
                        if(rstatus==200)
                        {
                            props.callme(ab.parentNode.id)
                       }}}>Approve
                    </button>
                    <button className={"btn bg-rose-500 text-white text-2xl hover:bg-rose-600 "} onClick={
                       async (event)=>{
                           let ab=event.target.parentElement
                           let rstatus=await decline(ab.parentNode.id,token)
                           if(rstatus==200) {
                               props.callme(ab.parentNode.id,)
                           }
                       }
                    }>Decline</button>
                </div>

            }
            {props.op==="completedevents" &&
                <div className={"flex justify-around mb-2 font-[cookie] "}>
                    <button className={"btn bg-blue-500 text-white text-2xl w-[38%] hover:bg-blue-600"} onClick={
                        (event) => {
                            let ab = event.target.parentNode
                            props.view(ab.parentNode.id)
                            console.log(ab.parentNode.id + "id")
                            props.cs("view")
                        }
                    }>View
                    </button>
                </div>

            }
            {props.op === "deletedevents" &&
                <div>
                    <button className={"btn bg-blue-500 text-white text-2xl w-[38%] hover:bg-blue-600"} onClick={
                        (event) => {
                            let ab = event.target.parentNode
                            props.view(ab.parentNode.id)
                            console.log(ab.parentNode.id + "id")
                            props.cs("view")
                        }
                    }>View
                    </button>
                </div>

            }

        </div>
    )
}

function Topbar() {
    const [msg, setmsg] = useState("");
    useEffect(() => {
        const callme = async () => {
            let resp = await fetch("http://localhost:3000/admin/whoami", {
                headers: {
                    "token": token
                }
            })
            let name = await resp.text();
            let resp1 = await fetch("http://localhost:3000/admin/wish")
            let wish = await resp1.text();
            let finalmsg = wish + "," + " " + name;
            console.log(finalmsg)
            setmsg(finalmsg)

        }
        callme()
    }, [])
    return (
        <div>
            <h1 className={" font-[cookie] text-5xl"}>{msg}</h1>
        </div>
    )


}

function Logoout() {
    return (
        <div className="group relative flex flex-col items-center justify-center w-[80px] h-[80px] hover:w-[200px] hover:h-[200px] transition-all duration-300 ease-in-out">
            <div className="border rounded-lg">
                <img src={logo} className="w-[48px]" />
            </div>

            {/* Logout Button */}
            <div className="absolute bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                <button className="btn bg-blue-500 text-white px-4 py-2 w-[140px] hover:bg-blue-600" onClick={()=>{
                    window.location.replace("http://localhost:63342/practice/findpartner/src/pages/admin.html?_ijt=4v8rk7na9hg3i0lns2eto795cb&_ij_reload=RELOAD_ON_SAVE")
                }}>
                    Logout
                </button>
            </div>
        </div>
    );
}


function Create() {
    let [eventstatus, seteventstatus] = useState(0);
    let [participant, setparticipant] = useState("everyone");
    return (
        <div className={"flex justify-between"}>
            <div className={"inline-flex flex-col ml-100 mt-12 h-[500px] justify-around card card-border pl-12"}>
                <div>
                    <label className={"mr-2"}>Select Image:</label>
                    <input id={"image"} type={"file"} placeholder={"attach the image"} className={"file-input"}
                           required/>
                </div>
                <div>
                    <label className={" mr-1"}>Choose a Category: </label>
                    <select id="cat" className={"select"} required>
                        <option value={"web"} >web</option>
                        <option value={"web3"} >web3</option>
                        <option value={"AI"} >AI/ML</option>
                        <option value={"others"} >others</option>
                    </select>
                </div>
                <div>
                    <label className={"mr-2"}>Select Date:</label>
                    <input id={"date"} type={"date"} className={"input"} required/>
                </div>
                <input id={"size"} type={"text"} placeholder={"Team Size :"} className={"input"} required/>
                <div className={"flex flex-col"}>
                    <label className={"mr-2"}>Description:</label>
                    <textarea id={"des"} rows={"3"} className={"input"}></textarea>
                </div>
                <div>
                    <label className={"mr-2"}>Who Can Participate:</label>
                    <select id={"user"} className={"select"}>
                        <option value={"everyone"} onClick={() => {
                            setparticipant("everyone")
                        }}>Anyone
                        </option>
                        <option value={"@vitapstudent.ac.in"} onClick={() => {
                            setparticipant("@vitapstudent.ac.in")
                        }}>@vitapstudent.ac.in
                        </option>
                        <option value={"custom"} onClick={() => {
                            setparticipant("custom")
                        }}>Custom
                        </option>
                    </select>
                </div>
                {participant === "custom" &&
                    <input id={"custom"} placeholder={"Enter custom mail-id"} className={"input"} required/>

                }
                <button className={"btn  text-2xl w-[85%] font-[cookie]"} onClick={async () => {
                    let events = await create(token)
                    seteventstatus(events);
                    setTimeout(()=>{
                        window.location.reload();
                    },4000)

                }}>Create ⊕
                </button>
            </div>
            <div>
                {

                    eventstatus==200&&<Success />

                }
            </div>
            <div>
                {
                    eventstatus==500&&<Error />

                }
            </div>
        </div>

    )

}
function Success()
{
    return(
        <div className={"alert text-black border border-3 border-blue-500 rounded-md mt-32 ml-12"}>
            <p>Event has created successfully!</p>
        </div>
    )
}
function Error()
{
    return(
        <div className={"text-black"}>
            <p>Event not created!</p>
        </div>
    )
}

 function User(props)
{

   let [ab,setab]=useState([])
    let [c,setc]=useState(0)
    useEffect( ()=>{
      let callme=async ()=>{
         let cab =await finduser(props.ev[0]._id,token)
          setab(cab)
          if(cab[0]==="NO Participants")
          {
              setc(0)
          }
          else
          {
              setc(cab.length)
          }

      }
      callme()
    },[])

    console.log(ab)
    return (
    <div className={"card ml-[300px] mt-8"}>
        <p className={"card-title mb-8"}>Participants:{c}</p>
        {ab.map((email, index) => (
            <p key={index} className={"mb-4"}>{email}</p>
        ))}
        <p></p>

    </div>
)

}
export default App