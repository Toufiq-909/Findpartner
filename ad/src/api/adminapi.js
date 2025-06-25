export let create=async (token)=>
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
           let response=await fetch("http://localhost:3000/adminportal/add",{
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
           let response=await fetch("http://localhost:3000/adminportal/add2",{
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
export let approve=async (id,token)=>{
    console.log(id)
    let resp=await fetch("http://localhost:3000/adminportal/reqeventapp",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "token":token
        },
        body:JSON.stringify({
            id:id
        })
    });
    return resp.status;
}
export let decline=async (id,token)=>{
    console.log(id)
    let resp=await fetch("http://localhost:3000/adminportal/reqeventdecline",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "token":token
        },
        body:JSON.stringify({
            id:id
        })
    });
    return resp.status;
}
export let finduser=async (x,token)=>{
    let resp=await fetch("http://localhost:3000/adminportal/getview?v="+x,{
        headers:{
            "token":token
        }
    })
   if(resp.status==204)
   {
       return ["NO Participants"]
   }
   else if(resp.status==200)
   {
       let ab=await resp.json()
       console.log("Ab"+ab)

       return ab
   }


}
export let move=async (id,token)=>{
    let res=await fetch("http://localhost:3000/adminportal/done",{
        method:"delete",
        headers:{
            "Content-Type":"application/json",
            "token":token
        },
        body:JSON.stringify({
            id:id
        })


    })
    return res.status;
}
export let dely=async (id,token)=>{
    let res=await fetch("http://localhost:3000/adminportal/delete",{
        method:"delete",
        headers:{
            "Content-Type":"application/json",
            "token":token
        },
        body:JSON.stringify({
            id:id
        })


    })
    return res.status;
}