const HttpError = require("../models/http-error");
const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    if(req.method==='OPTIONS'){
        return next();
    }
    try{
        const token=req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('authentication failed');
        }
        const decodedToken=jwt.verify(token, process.env.jwt);
        req.userData={userId:decodedToken.userId};
        next();
    }catch(err){
        const error=new HttpError('Authorization failed',401);
        return next(error);
    }
}