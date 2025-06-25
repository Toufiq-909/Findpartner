const exp=require('express');
const router=exp.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const {Resend}=require('resend');
const {z}=require('zod');
const {a,otps}=require('../src/db.js');
require('dotenv').config()
let jwt_secret=process.env.jwtpassword;

router.post('/signup',async (req,res)=>{
    let otpnumber=0;
    if(req.body.resend)
    {
        otpnumber=parseInt(Math.random()*1000000);
        console.log(otpnumber)
        let user=await otps.updateOne({
                email:req.body.mail
            },
            { $set:{
                    otp:otpnumber.toString()

                }
            })
        console.log(user)

    }
    else
    {
        let requiredschema=z.object({
            mail:z.string().min(6).max(100).email("invalid mail"),
            password:z.string().min(2,"password is to small").max(50,"Password is to big"),
            username:z.string().min(4,"username is to small").max(30,"Username is to big")

        })
        console.log(req.body)
        let result=requiredschema.safeParse(req.body)
        if(result.success)
        {
            console.log("are we execuitng")
            otpnumber=parseInt(Math.random()*1000000)
            try
            {
                await otps.create({
                    otp:otpnumber.toString(),
                    email:req.body.mail,
                })
            }
            catch(e)
            {
                console.log(e)
                return res.sendStatus(409);
            }

        }
        else
        {
            console.log(result.error.format())
            return res.status(444).json(result.error.format());
        }
    }
    const resend = new Resend('re_btPCxRqz_MUPnAdaYFZcr7ZC6dixKe1Yg');
    console.log(otpnumber)
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [req.body.mail],
            subject: 'Use This OTP to Complete Your Login',
            html: '<p>Your OTP code is: '+otpnumber+'</p>' +
                '<p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>'+
                '<p>If you did not request this, please ignore this email.</p>'
        });
        return res.sendStatus(200)
    }
    catch(e)
    {
        console.log(e)
        res.sendStatus(500);
    }

});
router.post("/signin",async (req,res)=>{
    let bg=req.body.mail;
    console.log(bg)
    let c=await a.findOne({email:bg})
    console.log(c);
    if(c)
    {
        let passwordchecking=await bcrypt.compare(req.body.password,c.password)

        if(passwordchecking) {
            let token = jwt.sign({id:c._id}, jwt_secret)
            console.log("valid password")
            res.status(200).json({
                token:token
            })
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
        res.sendStatus(409)
    }


})
router.post("/checkme",async (req,res)=>{
    let mail=req.body.mail;
    let otp=req.body.otp;
    let user="";
    let findinguser=await otps.find({
        email:mail,
        otp:otp
    })
    console.log(findinguser)
    if(findinguser.length>0)
    {
        try
        {
            let hashedpassword=await bcrypt.hash(req.body.password.toString(),1);

         user  = await a.create({
                email:req.body.mail,
                password:hashedpassword,
                name:req.body.name
            });
         console.log(user)
         let token=jwt.sign({id:user._id},jwt_secret)
            console.log(token)
            return res.status(200).json(token)

        }
        catch(e)
        {
            console.log(e);
            return res.sendStatus(409);
        }


    }
    else
    {
        return res.sendStatus(403)
    }
})
router.delete("/delete",async (req,res)=>{
    let mail=req.body.mail;
    try {
        await otps.deleteOne({email: mail})
        return res.sendStatus(200)
    }
    catch
    {
        return res.sendStatus(500)
    }
})
module.exports=router;