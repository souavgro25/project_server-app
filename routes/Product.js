const express=require('express');
const router=express.Router();
const path=require('path');
const fs=require('fs');
const multer = require('multer');
const ProductModel=require('../db/ProductModel');
const imageUpload = require("../middlewares/multer")
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');


router.post('/addProduct',[auth,admin],imageUpload.single('attach'),(req,res)=>{
	const category_id=req.body.category_id;
    const filename=req.file.filename;
    const name=req.body.name;
    const price = req.body.price;
    const quantity=req.body.quantity;
    const features=req.body.features;
    const product=new ProductModel({category_id:category_id,name:name,price:price,quantity:quantity,image:filename,feature:features});
    product.save(err=>{
        if(err){
            res.json({'err':1,'msg':err.message})
        }
        else {
            res.json({'err':0,'msg':'product Saved'})
        }
    })
}, 
(error, req, res, next) => {
    res.json({'err':1,'msg':'Uploading errror'})
}
)

router.get('/getProduct',(req,res)=>{
    ProductModel.find({},(err,data)=>{
        if(err){ 
            res.json({'err':1,'msg':'Something went wrong'})
        }
        else {
            res.json({'err':0,'Productdata':data})
        }
    })
})

router.delete('/deleteProduct/:id',[auth,admin],(req,res)=>{
    let id=req.params.id;
    ProductModel.findOne({_id:id},(err,data)=>
    {
        if(err){}
    ProductModel.deleteOne({_id:id},(err)=>{
        if(err){
            res.json({'err':1,'msg':'product not deleted'})
        }
        else {
         
              fs.unlinkSync(`uploads/${data.image}`);
              res.json({'err':0,'msg':'product deleted'})
              
        }
            
    })
    })
})

router.patch('/updateProduct/:id',imageUpload.single('attach'),async(req,res)=>{

    const id =req.params.id;
    const category_id=req.body.category_id;
    const image=req.file.filename;
    const name=req.body.name;
    const price = req.body.price;
    const quantity=req.body.quantity;
    const feature=req.body.features;
   
    const data= ProductModel.findOne({_id:id},async(err,data)=>{

    await ProductModel.findByIdAndUpdate({_id:id},
            {$set:{
                name,
                image,
                category_id,
                price,
                quantity,
                feature
                }
               
            },{new:true},(err)=>{
                
            if(err){
                res.json({'err':1,'msg':'product not updated'})
                console.log(err)
            }
            else {
         
                fs.unlinkSync(`uploads/${data.image}`);
                res.json({'err':0,'msg':'product updated'})
              
        }

        }) 
    })
});





module.exports=router;