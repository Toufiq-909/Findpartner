const exp=require('express');
const mongoose = require("mongoose");
const cors=require('cors');
const userrouter=require('../routes/user.js')
const adminrouter=require('../routes/admin.js')
const adminportal=require('../routes/adminportal.js')
const userportal=require("../routes/userportal.js")
require('dotenv').config()
const app=exp();
callme()
app.use(exp.json());
app.use(cors())
app.use('/user',userrouter);
app.use('/admin',adminrouter)
app.use('/adminportal',adminportal)
app.use('/userportal',userportal)

 async function callme()
{

    try
    {
        await mongoose.connect(process.env.mongoconnect);
        app.listen(3000)
    }
    catch(e)
    {
        console.log(e);
    }
}



