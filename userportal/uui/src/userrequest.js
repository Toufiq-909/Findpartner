export let request=async (token)=>
{
    console.log("are we execuitng")
    let image=document.getElementById("image").files[0]
    console.log(image)
    let category=document.getElementById("cat").value
    let date=document.getElementById("date").value
    let teamsize=document.getElementById("size").value
    let text=document.getElementById("des").value
    let user=document.getElementById("user").value;
    if(user==="custom")
    {
        user=document.getElementById("custom").value;
    }

    let flag=0;
    if(category===""||date===""||teamsize===""||text==="")
    {
        alert("Hey,man you have missed few things please fill them")
    }
    else
    {
        if(image===undefined&&category==="web")
        {
            image="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*3T7J7csXY8u36acofw5N8g.jpeg";
            flag=1;


        }
        else if(image===undefined&&category==="web3")
        {
            image="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/653fe0d5c538f6e7736ab8f4_63d1a70e2fe07c7f11a6b195_637bb7c970c23116e14990d1_What%252520is%252520Web3.png"
            flag=1;

        }
        else if(image===undefined&&category==="AI")
        {
            image="https://www.altengt.com/images/aiml/aiml_banner.jpg"
            flag=1;
        }
        else if(image===undefined&&category==="others")
        {
            image="https://spotme.com/wp-content/uploads/2020/07/Hero-1.jpg"
            flag=1;
        }
        if(flag==0)
        {
            let form=new FormData();
            form.append("img",image);
            form.append("category",category);
            form.append("date",date);
            form.append("text",text);
            form.append("teamSize",teamsize)
            form.append("user",user);
            console.log(form)
            let response=await fetch("http://localhost:3000/userportal/add",{
                method:"POST",
                headers:{
                    "token":token,
                    "flag":flag
                },
                body:form
            })
            console.log(response.status);
            console.log(typeof response.status)
            return response.status
        }
        if(flag==1)
        {
            console.log(image);
            console.log(category);
            console.log(date);
            console.log(teamsize);
            console.log(text);
            console.log(user);
            let response=await fetch("http://localhost:3000/userportal/add2",{
                method:"POST",
                headers:{
                    "token":token,
                    "flag":flag,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    image:image,
                    category:category,
                    date:date,
                    text:text,
                    teamSize:teamsize,
                    user:user
                })
            })
            console.log(response.status);
            console.log(typeof response.status)
            return response.status
        }
    }

}
export let join=async (id,token)=>{
    let res=await fetch("http://localhost:3000/userportal/join",{
        method:"Post",
        headers:
            {
                "Content-Type":"application/json",
                "token":token
            },
        body:JSON.stringify({
            id:id
        })
    })
    return res.status


}
export let chat=async (id,token)=>{
    console.log("lalalalall")

    let res=await fetch("http://localhost:3000/userportal/chat",{
        method:"Post",
        headers:
            {
                "Content-Type":"application/json",
                "token":token
            },
        body:JSON.stringify({
            id:id
        })
    })
    if(res.status==200)
    {
        console.log("success")
        let ab=await res.json();
        console.log(ab);
        return ab;
    }
    else if(res.status==204)
    {
        console.log("are we execuing")
        return ["You're welcome to begin contributing."]
    }

}
export let sendmsg=async (x,y,z)=>{
    let res=await fetch("http://localhost:3000/userportal/chatadd",{
        method:"Post",
        headers:
            {
                "Content-Type":"application/json",
                "token":y
            },
        body:JSON.stringify({
            id:x,
            msg:z
        })
    })
    if(res.status==200)
    {
        console.log("s")



    }
    else
    {
        console.log("failre")

    }

}