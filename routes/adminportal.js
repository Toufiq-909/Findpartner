const exp=require('express');
const router=exp.Router();
const jwt=require('jsonwebtoken')
const {adminadd,admin,deletedcourse,done,reqevent,view}=require("../src/db.js")
require('dotenv').config();
const multer=require('multer');
const upload = multer({ dest: 'temp/' });
const cloud=require('cloudinary').v2;
const mon=require('mongoose')
cloud.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.apikey,
    api_secret:process.env.apisecret
})
router.use(exp.json())
router.use((req,res,next)=>{
    console.log(req.headers.token)
    if(jwt.verify(req.headers.token,process.env.jwtpassword))
    {
        next();
    }
    else
    {
        return res.sendStatus(403)
    }
})
router.post("/add",upload.single('img'),async (req,res)=>{
    console.log("are we execuitng")

    let admindetails=jwt.verify(req.headers.token,process.env.jwtpassword);
    let adminall="";
    try
    {
         adminall=await admin.findOne({
            _id:admindetails.id
        })
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
    console.log("before")

   let img=req.file;

  let imgresult=await cloud.uploader.upload(img.path,{
       resource_type:"image"
   })
    console.log(imgresult.secure_url);


    let newcourse={
        category:req.body.category,
        image:imgresult.secure_url,
        date:req.body.date,
        teamSize:req.body.teamSize,
        text:req.body.text,
        creator:admindetails.id,
        name:adminall.email,
        user:req.body.user

    }

    try
    {
     let ab=await adminadd.create(newcourse);
        let view1={creator:adminall.email,
            users:[],
            eventid:ab._id
        }
        await view.create(view1)

        return res.sendStatus(200);

    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);

    }

})
router.post("/add2",async (req,res)=>{
    console.log("are we execuitng")

    let admindetails=jwt.verify(req.headers.token,process.env.jwtpassword);
    let adminall="";
    try
    {
        adminall=await admin.findOne({
            _id:admindetails.id
        })
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
    console.log(req.body)



    let newcourse={
        category:req.body.category,
        image:req.body.image,
        date:req.body.date,
        teamSize:req.body.teamSize,
        text:req.body.text,
        creator:admindetails.id,
        name:adminall.email,
        user:req.body.user

    }

    try
    {
        let ab=await adminadd.create(newcourse);
        let view1={creator:adminall.email,
            users:[],
            eventid:ab._id
        }
        await view.create(view1)

        return res.sendStatus(200);

    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);

    }

})
router.delete("/delete",async (req,res)=>{
    try
    {
       let deletingcourse= await adminadd.findOne({
            _id:req.body.id
        })
        console.log(deletingcourse.toObject())
        await deletedcourse.create(deletingcourse.toObject());
       await adminadd.deleteOne({
           _id:req.body.id
       })
        return res.sendStatus(200)
    }
    catch(e)
    {
        console.log(e)
        return res.sendStatus(500)

    }
})
router.delete("/done",async (req,res)=>{
    try
    {
        let deletingcourse= await adminadd.findOne({
            _id:req.body.id
        })
        await done.create(deletingcourse.toObject());
        await adminadd.deleteOne({
            _id:req.body.id
        })
        return res.sendStatus(200)
    }
    catch(e)
    {
        console.log(e)
        return res.sendStatus(500)
    }
})
router.get("/completedevents",async (req,res)=> {
    try {
        let result = await done.find().lean();
        return res.status(200).json(result)
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
})
    router.get("/deletedevents",async (req,res)=>{
        try
        {
            let result=await deletedcourse.find().lean();
            return res.status(200).json(result)
        }
        catch(e)
        {
            console.log(e);
            return res.sendStatus(500);
        }

})
router.put("/edit",upload.single('img'),async (req,res)=>{
  try
  {
      let img=req.file;
      let result=await cloud.uploader.upload(img.path,{
          resource_type:"image"
      })
      await adminadd.updateOne({_id:req.body.id},{
          $set:{
              image:result.secure_url
          }
      })
      console.log(result.secure_url);
      return res.sendStatus(200);
  }
  catch(e)
  {
      console.log(e);
      return res.sendStatus(500);
  }

})
router.put("/edit2",async (req,res)=>{
    try
    {
        await adminadd.updateOne({
            _id:req.body.id},
        {
            $set:req.body.updates
        }
        )
        return res.sendStatus(200);

    }
    catch(e)
    {
        console.log(e)
        return res.sendStatus(500)
    }


})
router.get("/web3",async (req,res)=>{
    try
    {
        let webevents= await adminadd. find({
            category:"web3"
        }).lean();
        return res.status(200).json(webevents)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/web",async (req,res)=>{
    try
    {
        let webevents= await adminadd. find({
            category:"web"
        }).lean();
        return res.status(200).json(webevents)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/ai",async (req,res)=>{
    try
    {
        let webevents= await adminadd. find({
            category:"ai"
        }).lean();
        return res.status(200).json(webevents)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/others",async (req,res)=>{
    try
    {
        let webevents= await adminadd. find({
            category:"other"
        }).lean();
        return res.status(200).json(webevents)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/Events",async (req,res)=>{
    try
    {
        let webevents= await adminadd. find();
        console.log(webevents)
        return res.status(200).json(webevents)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/reqevent",async (req,res)=>{
    try
    {
        let webevents= await reqevent.find().lean();
        return res.status(200).json(webevents)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
});
router.put("/reqeventapp",async (req,res)=>{
    try
    {
        console.log(req.body.id)
        let webevents= await reqevent.findOne({
            _id:req.body.id
        })
      let  ab= await adminadd.create(webevents.toObject())

        let admindetails=jwt.verify(req.headers.token,process.env.jwtpassword);
        let adminall="";

            adminall=await admin.findOne({
                _id:admindetails.id
            })
        console.log(adminall+"adminall")
        await view.create({
            creator:adminall.email,
            users:[],
            eventid:ab._id
        })


        await reqevent.deleteOne({
            _id:req.body.id
        })
        return res.sendStatus(200)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
});
router.put("/reqeventdecline",async (req,res)=>{
    try
    {
        let webevents= await reqevent.findOne({
            _id:req.body.id
        })
        await deletedcourse.create(webevents.toObject())
        await reqevent.deleteOne({
            _id:req.body.id
        })
        return res.sendStatus(200)
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
});
router.post("/view",async (req,res)=>{
 try
 {
     let result=await view.findOne({
         eventid:new mon.Types.ObjectId(req.body.eventid)
     })
     console.log(result)
     return res.status(200).json(result)
 }
 catch(e)
 {
     console.log(e);
     return res.sendStatus(500);
 }

})
router.get("/getview",async (req,res)=>{
    let result=await view.findOne(
        {
            eventid:req.query.v
        }
    )
    console.log(result.users)
    console.log(result.users.length)

    if(result.users.length>0)
    {
        console.log("Are we excuting")
        return res.status(200).json(result.users)
    }
    else
    {
        return res.sendStatus(204)
    }

})
module.exports=router