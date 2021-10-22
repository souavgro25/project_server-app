const jwt = require("jsonwebtoken");
const seceret="sds^^^^^$%#@sdfs";
function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied . no token provided ');

    try {
        const decoded = jwt.verify(token, seceret);
        req.user = decoded
        console.log(req.user)
        next();
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}

module.exports=auth;