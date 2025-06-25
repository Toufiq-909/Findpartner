const exp=require('express');
const {admin,adminotp,wish} = require("../src/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router=exp.Router();
require('dotenv').config();
let jwt_secret=process.env.jwtpassword;
let {Resend}=require('resend');
const sendmail=new Resend('re_btPCxRqz_MUPnAdaYFZcr7ZC6dixKe1Yg')
router.post("/signin",async (req,res)=>{
    let bg=req.body.email;
    console.log(bg)
    let c=await admin.findOne({email:bg})
    console.log(c);

    if(c)
    {
        let passwordchecking=await bcrypt.compare(req.body.password,c.password)

        if(passwordchecking) {
            let otp=parseInt(Math.random()*1000000);
            try
            {
                await adminotp.create({
                    email:bg,
                    otp:otp
                })
            }
            catch(e)
            {
                console.log(e);
              return  res.sendStatus(500)
            }
            ;
          try
          {
              await sendmail.emails.send({
                  from:"onboarding@resend.dev",
                  to:bg,
                  subject: 'Use This OTP to Complete Your Login',
                  html: '<p>Your OTP code is: '+otp+'</p>' +
                      '<p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>'+
                      '<p>If you did not request this, please ignore this email.</p>'
              })
             return res.sendStatus(200)
          }
          catch(e)
          {
              console.log(e);
              res.sendStatus(500)
          }
        }
        else
        {
            console.log("invalid password")
            res.sendStatus(401)

        }

    }
    else
    {
        console.log("invalid mail")
        res.sendStatus(403)
    }


});
router.post("/checkme",async (req,res)=>{
    let mail=req.body.mail;
    let otp=req.body.otp;
    let findinguser=await adminotp.findOne({
        email:mail,
        otp:otp
    })
    //token of admin id not adminotp fix this, try,popullte,couldinary
    if(findinguser)
    {
        let adminall=await admin.findOne({
            email:mail
        })
        let token = jwt.sign({id:adminall._id}, jwt_secret)
        console.log("valid password")
        res.status(200).json({
            token:token
        })




    }
    else
    {
        return res.sendStatus(403)
    }
})
router.delete("/delete",async (req,res)=>{
    let mail=req.body.mail;
    try {
        await adminotp.deleteOne({email: mail})
        return res.sendStatus(200)
    }
    catch
    {
        return res.sendStatus(500)
    }
})
router.post("/again",async (req,res)=>{
    let otp=parseInt(Math.random()*1000000);
    await adminotp.updateOne({
        email:req.body.email
    },
        { $set:{
        otp:otp
    }});
    try
    {

        await sendmail.emails.send({
            from:"onboarding@resend.dev",
            to:req.body.email,
            subject: 'Use This OTP to Complete Your Login',
            html: '<p>Your OTP code is: '+otp+'</p>' +
                '<p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>'+
                '<p>If you did not request this, please ignore this email.</p>'
        })
        return res.sendStatus(200)
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(500)
    }

})
router.get("/whoami",async (req,res)=>{
  try
  {
      let admi=jwt.verify(req.headers.token,jwt_secret);
      console.log(admi)
      let admindetails=await admin.findOne({
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
        let wishes=await wish.find();
        let wisharray=wishes[0].wish;
        let sendingmsg=wisharray[Math.floor(Math.random()*20)]
        return res.status(200).send(sendingmsg);

    }
    catch(e)
    {
        console.log(e);
        return res.sendStatus(500);
    }
})
module.exports=router;


