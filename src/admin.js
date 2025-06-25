async function ing()
{
    let a=document.querySelector('#i').value;
    let b=document.querySelector('#j').value;
    if(a===''||b==='')
    {
        alert("Hey man you have missed few things please fill them all")

    }
    else
    {
        let res=await fetch("http://localhost:3000/admin/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:a,
                password:b
            })
        })
        if(res.ok)
        {
            localStorage.setItem("admin_mail",a)
            localStorage.setItem("admin_password",b)
            window.location.href="../pages/adminotp.html"
        }
        else if(res.status==401)
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
        else
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

    }
}
async function dp()
{
    let a=""
    let i=localStorage.getItem("admin_mail")
    let j=localStorage.getItem("admin_password")
    let arrayofotp=document.querySelectorAll("input");
    arrayofotp.forEach((element)=>{
        a=a+element.value;
    })
    if(a.length<6)
    {
        alert("Hey man,you have missed few things please check  them and confirm your mail address")
    }
    else {
        let resp = await fetch("http://localhost:3000/admin/checkme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mail: i,
                otp: a,
                password: j,
            })
        })
        if (resp.ok) {
            let response=await resp.json();
            console.log(response.token);
            localStorage.setItem('admintoken',response.token);
            let token=localStorage.getItem('admintoken');
            window.location.replace("http://localhost:5173/?token="+token)
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