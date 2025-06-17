const mongoose=require('mongoose');
const config=require("config")
const dbgr=require("debug")("development:mongoose");


mongoose.connect(`${config.get("MONGODB_URI")}/sppucodeportal`)
.then(function(){
    console.log("Database Connection Done!")
    dbgr("Connected!");
})
.catch(function(err){
    dbgr(err);
})


module.exports=mongoose.connection;