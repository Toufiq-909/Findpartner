const exp=require('express');
const router=exp.Router();
const {uw,a,adminadd,reqevent,join,view,chat}=require('../src/db.js')
const jwt = require("jsonwebtoken");
const {v2: cloud} = require("cloudinary");
require('dotenv').config()
const multer=require('multer');
const upload = multer({ dest: 'temp/' });
const jwt_secret=process.env.jwtpassword
cloud.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.apikey,
    api_secret:process.env.apisecret
})
router.use(exp.json())
router.use(async (req,res,next)=>{
    console.log(req.headers.token)
    if(jwt.verify(req.headers.token,jwt_secret))
    {
        let token=jwt.verify(req.headers.token,jwt_secret)
        req.user=await a.findOne({
            _id:token.id
        })
        console.log("user"+req.user)
        next()
    }
    else
    {
        res.sendStatus(403);
    }

})
router.get("/whoami",async (req,res)=>{
    try
    {
        let admi=jwt.verify(req.headers.token,jwt_secret);
        console.log(admi)
        let admindetails=await a.findOne({
            _id:admi.id
        })
        console.log(admindetails)
        let splitarray=admindetails.email.split("@")
        return res.status(200).send(splitarray[0])
    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/wish",async (req,res)=>{
    try
    {
        let wishes=await uw.find();
        console.log(wishes)
        let wisharray=wishes[0].wish;
        console.log(wisharray)
        let sendingmsg=wisharray[Math.floor(Math.random()*20)]
        let a=req.user.email.split("@")
        console.log(a[1]+"can be")

        return res.status(200).send(sendingmsg);

    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
router.get("/event",async (req,res)=>{
    let a=req.user.email.split("@")
    a[1]="@"+a[1]
    console.log(a[1])
   try
   {
       let cat=req.query.category;
       let joinevents="";
       joinevents=await join.find({
           user:req.user.email
       })
       const je = joinevents.length > 0 ? joinevents[0].eventid : [];
       if(cat==="Home")
       {


           let events=await adminadd.find({
              $and:[
                  {_id:{$nin:je}},
                  {
                      $or:[
                          {user:"everyone"},
                          {user:a[1]}
                      ]
                  }
              ]
           })
           return res.status(200).json(events)
       }
       else if(cat==="Events")
       {
           try
           {
               let joinevents=await join.findOne({
                   user:req.user.email
               }).populate("eventid")
               console.log(joinevents.eventid+"meeme")
               return res.status(200).json(joinevents.eventid)
           }
           catch(e)
           {
               console.log(e)
               return res.sendStatus(500)
           }

       }
       else
       {
           console.log(je)
           let events=await adminadd.find({
               $and:[
                   {_id:{$nin:je}},
                   {
                       $or:[
                           {user:"everyone"},
                           {user:a[1]}
                       ]
                   },
                   {
                       category:cat
                   }
               ]
           })
           return res.status(200).json(events)
       }
   }
   catch(e)
   {
       console.log(e);
       return res.sendStatus(500)
   }


})

router.post("/add",upload.single('img'),async (req,res)=>{
    console.log("are we execuitng")

    let admindetails=jwt.verify(req.headers.token,process.env.jwtpassword);
    let adminall="";
    try
    {
        adminall=await a.findOne({
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
        let ab=await reqevent.create(newcourse);



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
        adminall=await a.findOne({
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
        let ab=await reqevent.create(newcourse);


        return res.sendStatus(200);

    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);

    }

})
router.post("/join",async (req,res)=>{
   try
   {
       let user=req.user.email
       let eid=req.body.id
       let joinuser=await join.findOne({
           user:user
       })
      if(joinuser)
      {
          await join.updateOne({
              user:user
          },{
              $push:{
                  eventid:eid
              }
          })
      }
      else
      {
          await join.create({
              user:user,
              eventid:[eid]
          })
      }
      await view.updateOne({
          eventid:req.body.id
      },
          {
              $push:{
                  users:user
              }
          })

       return res.sendStatus(200)
   }
   catch(e)
   {
       console.log(e);
       return res.sendStatus(500)
   }
})
router.post("/chat",async (req,res)=>{

    let chatevent=await chat.findOne(
        {
            eventid:req.body.id
        }

    )
    if(chatevent!=null)
    {
        console.log("chat")
        return res.status(200).json(chatevent.msg)
    }
    else

    {
        await chat.create({
            eventid:req.body.id,
            msg:[{
                sender:"",
                msg:""
            }]
        })
        console.log("n0chat")
        return res.sendStatus(204)
    }
})
router.post("/chatadd",async (req,res)=>{

    let chatevent=await chat.updateOne(
        {
            eventid:req.body.id
        },
    {
        $push:{
            msg:{
                sender:req.user.email,
                msg:req.body.msg
            }

        }
    }

    )


})

module.exports=router