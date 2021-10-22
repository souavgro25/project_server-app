const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const seceret="sds^^^^^$%#@sdfs";
const saltRounds = 10;
const user=require('../db/User');


//file upload multer 

router.post('/adminlogin',(req,res)=>{
    //read values 
    let email=req.body.email;
    let password=req.body.password;
    user.findOne({email:email},(err,data)=>{
        if(err){
            res.json({'err':1,'msg':'Something Wrong'})
        }
        else if(data==null){
            res.json({'err':1,'msg':'Email or Password is not correct'});
        }
        else {
            if(bcrypt.compareSync(password, data.password))
            {
                const token = data.generateAuthtoken();
                console.log(token);
                res.json({'err':0,'msg':'Login Success','token':token});

            }
            else {
                res.json({'err':1,'msg':'Email or Password is not correct'});  
            }
        }
    })
 
})

router.post('/register',(req,res)=>{
    //read values 
    let name= req.body.name;
    let email=req.body.email;
    let password=req.body.password;  
    
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    // insert data 
    let ins=new user({name:name,email:email,password:hashPassword});
    ins.save(err=>{
        if(err) { res.json({'err':1,'msg':'Something Wrong'})}
        else {
            const payload={email};
                const token=jwt.sign(payload,seceret,{
                    expiresIn:'1h'
                })
            res.json({'err':0,'msg':'Registerd','token':token})
        }
    })
})

router.post('/changepassword',(req,res)=>{
    let op=req.body.op;
    let np=req.body.np;
    let uid=req.body.uid;
     np = bcrypt.hashSync(np, saltRounds)
    user.findOne({email:uid},(err,data)=>{
        if(err){ res.json({'err':1,'msg':'Something went wrong'})}
        else {
            if(bcrypt.compareSync(op, data.password))
            {
         user.updateOne({email:uid},{$set:{password:np}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Something went wrong'})
                    }
                    else {
                        res.json({'err':0,'msg':'Password Changed'})
                    }
                })
            
            }
            else {
                res.json({'err':1,'msg':'Old password is not correct'})   
            }
        }
    })
})

module.exports=router;