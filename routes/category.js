const express=require('express');
const router=express.Router();
const path=require('path');
const fs=require('fs');
const multer = require('multer');
const catModel=require('../db/categoryModel');
const imageUpload = require("../middlewares/multer")
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');

router.post('/addcategory',[auth,admin],imageUpload.single('attach'),(req,res)=>{
    let fname=req.file.filename;
    let cname=req.body.cname;
    let ins=new catModel({cname:cname,image:fname});
    ins.save(err=>{
        if(err){
            res.json({'err':1,'msg':'Category Already exists'})
        }
        else {
            res.json({'err':0,'msg':'Category Saved'})
        }
    })
}, (error, req, res, next) => {
    res.json({'err':1,'msg':'Uploading errror'})
})
router.get('/getcategory',[auth],(req,res)=>{
    catModel.find({},(err,data)=>{
        if(err){ 
            res.json({'err':1,'msg':'Something went wrong'})
        }
        else {
            res.json({'err':0,'catdata':data})
        }
    })
})

router.delete('/delcategory/:id',(req,res)=>
{
    let cid=req.params.id;
    catModel.findOne({_id:cid},(err,data)=>
    {
        if(err){}
    catModel.deleteOne({_id:cid},(err)=>{
        if(err){
            res.json({'err':1,'msg':'category not deleted'})
        }
        else {
         
              fs.unlinkSync(`uploads/${data.image}`);
              res.json({'err':0,'msg':'category deleted'})
              
        }
            
    })
    })
})

router.patch('/updatecategory/:id',imageUpload.single('attach'),async(req,res)=>{

    const cid =req.params.id;
    const cname=req.body.cname;
    const image=req.file.filename;
  
   
    const data= catModel.findOne({_id:cid},async(err,data)=>{

    await catModel.findByIdAndUpdate({_id:cid},
            {$set:{
                cname,
                image}
               
            },{new:true},(err)=>{
                
            if(err){
                res.json({'err':1,'msg':'category not updated'})
                console.log(err)
            }
            else {
         
                fs.unlinkSync(`uploads/${data.image}`);
                res.json({'err':0,'msg':'category updated'})
              
        }

        }) 
    })
});

module.exports=router;