import {useState} from 'react'
import {useEffect} from 'react'
import logo from '../../../images/icons8-user-96.png'
import {request,join,chat,sendmsg} from './userrequest.js'

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
   const [option,setoption]=useState("Home");
    const [events,setevent]=useState([]);
    useEffect( ()=>{
        const fetchdata=async ()=>{
            if(option!=="request"&&option!=="chat")
            {
                console.log(token)
                let res=await fetch("http://localhost:3000/userportal/event?category="+option,{
                    method:"GET",
                    headers:{
                        "token":token
                    }
                })
                let response=await res.json();
                console.log(response)
                setevent(response)


            }
        }
        fetchdata()
    },[option])
    const remove=(id)=>{
        setevent(events.filter(x=>x._id!=id))
    }
    const chat=(id)=>{
        setevent(events.filter(x=>x._id===id))
        console.log(events[0]._id)

    }
    const ops=(x)=>{
        setoption(x)
    }
    return (
        <div className={"flex"}>
            <div className={"inline-flex flex-col justify-evenly h-[500px] mt-6 ml-4 "}>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("Home")
                }}>
                    Dashboard

                </button>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("web")
                }}>
                    Web Dev

                </button>
                <button className={"btn  font-[cookie] text-4xl"} onClick={() => {
                    setoption("web3")
                }}>
                    Blockchain

                </button>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("AI")
                }}>
                    Ai/ML

                </button>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("others")
                }}>
                    Others

                </button>
                <button className={"btn   font-[cookie]  text-4xl"} onClick={() => {
                    setoption("Events")
                }}>
                    Events

                </button>
                <button className={"btn  font-[cookie] text-4xl"} onClick={() => {
                    setoption("request")
                }}>
                    Suggest

                </button>
            </div>
            <div className={"flex flex-wrap justify-around  "}>
                {(option!=="request") &&
                    events.map((x, index) => {
                        return   <Eventcomponent image={x.image}
                                                 category={x.category}
                                                 date={x.date}
                                                 teamSize={x.teamSize}
                                                 text={x.text}
                                                 id={x._id}
                                                 remove={remove}
                                                 op={option}
                                                 chat={chat}
                                                 ops={ops}
                        />
                    })

                }
                {option === "request" &&<Create />


                }





                {
                    option==="chat" &&<Chat
                    ev={events}
                    />
                }
            </div>


        </div>
    )


}



function Eventcomponent(props) {
    console.log("option"+props.op)
    return (
        <div className={"mt-8 inline-flex flex-col w-[400px] h-[600px] justify-between card card-border transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"} id={props.id}>
            <img  className={"h-[300px] w-[90%] mt-4 ml-4 rounded-lg"} src={props.image}/>
            <p className={"card-title ml-4 "}>Category : {props.category}</p>
            <p className={"card-title ml-4 "}>Date : {props.date}</p>
            <p className={"card-title ml-4 "}>Team Size : {props.teamSize}</p>
            <p className={"card-title ml-4 "}>Description : {props.text}</p>

            {
                props.op !== "Events" && props.op!=="chat" &&
                <button
                    className={"btn text-2xl text-white font-[cookie] mb-2 bg-blue-500 w-[80%] ml-8 hover:bg-blue-600"}
                    onClick={
                        async (event) => {
                            let ab = event.target.parentElement;
                            let rstatus = await join(ab.id, token);
                            if (rstatus == 200) {
                                props.remove(ab.id, token)
                            }
                        }
                    }>Join Now</button>
            }
            {
                props.op === "Events" && props.op!=="chat" &&
                <button
                    className={"btn text-2xl text-white font-[cookie] mb-2 bg-blue-500 w-[80%] ml-8 hover:bg-blue-600"}
                    onClick={
                        async (event) => {
                            let ab = event.target.parentElement;

                            props.chat(ab.id)
                            setTimeout(()=>{
                                props.ops("chat")
                            },0)

                        }
                    }>Join Chat</button>

            }
            {
                props.op==="chat" &&
                <div></div>

            }


        </div>
    )
}

function Topbar() {
    const [msg, setmsg] = useState("");
    useEffect(() => {
        const callme = async () => {
            console.log("token" + token)
            let resp = await fetch("http://localhost:3000/userportal/whoami", {
                headers: {
                    "token": token
                }
            })
            let name = await resp.text();
            let resp1 = await fetch("http://localhost:3000/userportal/wish", {
                headers: {
                    "token": token
                }
            })
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
                <button className="btn bg-blue-500 text-white px-4 py-2 w-[140px] hover:bg-blue-600" onClick={
                    ()=>{
                        window.location.replace("http://localhost:63342/findpartner/src/pages/index.html?_ijt=10ncjio09rqe7ac2tnkorcaq5k&_ij_reload=RELOAD_ON_SAVE")
                    }
                }>
                    Logout
                </button>
            </div>
        </div>
    );
}


function Create() {
    let [eventstatus, seteventstatus] = useState(0);
    let [participant, setparticipant] = useState("everyone");
    let [flag,setflag]=useState(false)
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
                    let events = await request(token)
                    seteventstatus(events);
                    setTimeout(()=>{
                        setflag(true)
                    },4000)
                    if (events === 200) {
                        // Clear the form manually
                        document.getElementById("image").value = "";
                        document.getElementById("cat").value = "web";
                        document.getElementById("date").value = "";
                        document.getElementById("size").value = "";
                        document.getElementById("des").value = "";
                        document.getElementById("user").value = "everyone";
                        setparticipant("everyone");
                        if (document.getElementById("custom")) {
                            document.getElementById("custom").value = "";
                        }
                    }

                }}>Request
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
        <div className={" alert text-black border border-3 border-blue-400 rounded-md mt-32 ml-12 jk"}>
            <p>Event has Requested successfully!</p>
        </div>
    )
}
function Error()
{
    return(
        <div className={"alert text-black"}>
            <p>Event not requested!</p>
        </div>
    )
}

function Chat(props)
{
    console.log("count")
    let [r,sr]=useState([])
    useEffect(() => {
        const callme = async () => {

                let j = await chat(props.ev[0]._id, token)
                sr(j);

        }
        callme();
    }, []);

console.log(r)
 console.log(typeof r)
    return (
        <div className={"card card-border shadow:lg ml-[300px] mt-[50px] w-[400px]  flex flex-col justify-around"}>
            {
                r.map((x)=>{
                    if(x.sender!=="")
                    {
                        return(
                            <div>
                                <p>
                                    {x.sender}
                                </p>
                                <p>
                                    {x.msg}
                                </p>
                            </div>
                        )
                    }
                    else
                    {
                        return null;
                    }
                })
            }
            <input type={"text"} className={"input"} placeholder={"Type Message"} id={"in"}/>
            <button className={"btn bg-blue-500 hover:bg-blue-600 text-white"}
                    onClick={
                        ()=>{
                            let gh=document.querySelector("#in").value;
                            sendmsg(props.ev[0]._id,token,gh)
                        }
                    }
            >Send Message</button>
        </div>
    )
}

export default App