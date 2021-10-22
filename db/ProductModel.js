const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
    category_id:{type:String,required:true},
    name:{type:String,unique:true,required:true},
    price:{type:Number,default:1,required:true},
    feature :{type:String,maxlength:256},
    quantity:{type:Number,required:true},
    image:{type:String,required:true},
    created_at:{type:Date,default:Date.now}
})
module.exports=mongoose.model('Product',ProductSchema);