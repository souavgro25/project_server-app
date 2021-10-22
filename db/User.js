const mongoose=require('mongoose');
const jwt = require("jsonwebtoken");
const seceret="sds^^^^^$%#@sdfs";
const UserSchema=new mongoose.Schema({
    email:{type:String,unique:true},
    password:{type:String,required:true},
    created_at:{type:Date,default:Date.now},
    isAdmin: Boolean,
});
UserSchema.methods.generateAuthtoken = function(){
    const token= jwt.sign({email:this.email,_id:this._id,isAdmin:this.isAdmin},seceret)
    return token;
}
module.exports=mongoose.model('User',UserSchema);