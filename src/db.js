const mon=require('mongoose');
let ObjectId=mon.Schema.ObjectId
let schema=new mon.Schema({
    email:{type:String,unique:true},
    password:String,
    name:String

});
let schema2=new mon.Schema({
    otp:String,
    email:{type:String,unique:true}
})
let schema3=new mon.Schema({
    email:String,
    password:String
})
let s4=new mon.Schema({
    category:String,
    image:String,
    date:String,
    teamSize:String,
    text:String,
    creator:{type:mon.Schema.Types.ObjectId,ref:'admins'},
    name:String,
    user:String
})
let s5=new mon.Schema({
    creator:String,
    users:[String],
    eventid:{
        type:mon.Schema.Types.ObjectId,
        ref:'events'
    }
})
let s6=new mon.Schema({
    wish:[String]
})
let s7=new mon.Schema(
    {
        user:String,
        eventid:{
           type: [mon.Schema.Types.ObjectId],
            ref:'events'
        }


    }
)
let s8=new mon.Schema({
    eventid:{
        type:mon.Schema.Types.ObjectId,
        ref:"events"
    },
    msg:[
        {
            sender: String,
            msg: String
        }
    ]
})
let otpmodel=mon.model('otp',schema2);
let usermodel=mon.model('users',schema);
let adminmodel=mon.model('admin',schema3)
let adminotp=mon.model('adminotp',schema2)
let adminadd=mon.model('events',s4)
let deletedcourse=mon.model('trash',s4)
let done=mon.model('done',s4)
let view=mon.model('participants',s5)
let reqevent=mon.model('requestedevent',s4)
let wish=mon.model('wishes',s6)
let uw=mon.model('userwish',s6)
let join=mon.model('userevents',s7)
let chat=mon.model('chats',s8)
module.exports={
    a:usermodel,
    otps:otpmodel,
    admin:adminmodel,
    adminotp:adminotp,
    adminadd:adminadd,
    deletedcourse:deletedcourse,
    done:done,
    reqevent:reqevent,
    view:view,
    wish:wish,
    uw:uw,
    join:join,
    chat:chat

}