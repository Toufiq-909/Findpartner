async function up()
{
    let i=document.querySelector("#i").value;
    let j=document.querySelector('#j').value;
    let k=document.querySelector('#k').value;
   if(i===""||j===""||k==="")
   {
       alert("Hey man, you forgot something! Fill in all the fields");
   }
   else
   {
       let res=await fetch("http://localhost:3000/user/signup",{
           method:"POST",
           headers:{
               "Content-Type":"application/json"
           },
           body:JSON.stringify({
               mail:i,
               password:j,
               username:k,
               resend:false
           })
       })
       if(res.ok)
       {
           console.log("are we ecx")
           localStorage.setItem("mail",i)
           localStorage.setItem("username",k)
           localStorage.setItem("password",j)


           window.location.replace("otp.html")
       }
       else if(res.status==409)
       {
           let h=document.querySelector(".mail");
           let msg=document.createElement("p")
           msg.innerHTML="Oops! This email is already taken. Try another one!";
           msg.style.fontFamily="cookie"
           msg.style.color="red"
           msg.style.fontSize="40px"
           if(h.children.length==1)
           {
               h.appendChild(msg)
               setTimeout(()=>{
                   h.removeChild(h.children[1])
               },10000)
           }
       }
       else
       {
           let response= await res.json()
           if('mail' in response)
           {
               let h=document.querySelector(".mail");
               let msg=document.createElement("p")
               msg.innerHTML="Invalid Mail";
               msg.style.fontFamily="cookie"
               msg.style.color="red"
               msg.style.fontSize="40px"
               if(h.children.length==1)
               {
                   h.appendChild(msg)
                   setTimeout(()=>{
                       h.removeChild(h.children[1])
                   },10000)
               }

           }
           if('username' in response)
           {
               console.log("invlalid username");
               let h=document.querySelector(".username");
               let msg=document.createElement("p")
               msg.innerHTML="Username too short! Please enter at least 4 characters";
               msg.style.fontFamily="cookie"
               msg.style.color="red"
               msg.style.fontSize="40px"
               if(h.children.length==1)
               {
                   h.appendChild(msg)
                   setTimeout(()=>{
                       h.removeChild(h.children[1])
                   },10000)

               }

           }
           if('password' in response)
           {
               let h=document.querySelector(".password");
               let msg=document.createElement("p")
               msg.innerHTML="Password too short! Please enter at least 4 characters";
               msg.style.fontFamily="cookie"
               msg.style.color="red"
               msg.style.fontSize="40px"
               if(h.children.length==1)
               {
                   h.appendChild(msg)
                   cp=1;
                   setTimeout(()=>{
                       h.removeChild(h.children[1])
                       cp=0
                   },10000)
               }


           }
           console.log("sign up in failed")
       }
   }

}
async function ing()
{
    let i=document.querySelector("#i").value;
    let j=document.querySelector('#j').value;
    if(i===""||j==="")
    {
        alert("Hey man, you forgot something! Fill in all the fields");
    }
    else
    {
        let res=await fetch("http://localhost:3000/user/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                mail:i,
                password:j
            })
        })
        if(res.ok)
        {
            let data=await res.json();
            let h=data.token;

            localStorage.setItem('usertoken',h)
            console.log(h);
            window.location.href="http://localhost:5174/?token="+h;

        }
        else if(res.status==409)
        {
            let h=document.querySelector(".mail");
            let msg=document.createElement("p")
            msg.innerHTML="Invalid Mail";
            msg.style.fontFamily="cookie"
            msg.style.color="red"
            msg.style.fontSize="40px"
           if(h.children.length==1)
           {
               h.appendChild(msg)

               setTimeout(()=>{
                   h.removeChild(h.children[1])
               },10000)
           }
        }
        else
        {
            let h=document.querySelector(".password");
            let msg=document.createElement("p")
            msg.innerHTML="Invalid Password";
            msg.style.fontFamily="cookie"
            msg.style.color="red"
            msg.style.fontSize="40px"
            if(h.children.length==1)
            {
                h.appendChild(msg)
                setTimeout(()=>{
                    h.removeChild(h.children[1])
                },10000)
            }
        }

    }
}
async function dp()
{
    let a=""
    let i=localStorage.getItem("mail")
    let j=localStorage.getItem("password")
    let k=localStorage.getItem("username")
    let arrayofotp=document.querySelectorAll("input");
    arrayofotp.forEach((element)=>{
        a=a+element.value;
    })
    if(a.length<6)
    {
        alert("Hey man,you have missed few things please check  them and confirm your mail address")
    }
    else {
        let res = await fetch("http://localhost:3000/user/checkme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mail: i,
                otp: a,
                password: j,
                name: k
            })
        })
        if (res.ok) {
            let response=await res.json()
            console.log(response)
            window.location.replace("http://localhost:5174/?token="+response)

        } else {
            let h=document.querySelector("body");
            let msg=document.createElement("p")
            msg.innerHTML="Invalid Otp";
            msg.style.fontFamily="cookie"
            msg.style.color="red"
            msg.style.fontSize="40px"
            msg.style.textAlign="center"
            msg.style.marginRight="20px"
            console.log(h.children)
            if(h.children.length==4)
            {
                h.appendChild(msg)
                setTimeout(()=>{
                    h.removeChild(h.children[4])
                },4000)
            }



        }
    }
}
//while signing in user's can enter emaol
// work on ui and after two minutes otp exipres and send agian button pops up