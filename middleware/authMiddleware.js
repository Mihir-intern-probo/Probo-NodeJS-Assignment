const jwt = require('jsonwebtoken');
const asyncHandler=require("express-async-handler");
const pool = require('../config/db');
const { User } = require('../models/userModel');

const protect = asyncHandler(async(req,res,next)=>{
    let token;
    var check = 'select * from user';
    const [allUsers,_] = await pool.execute(check);
    if(allUsers.length==0){
        next();
    }else{
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            try{
                token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token,process.env.JWT_SECRET);
                const data = new User();
                const val = data.checkAlreadyCreated(decoded.id);
                if(val.length===0){
                    res.status(400).json({Message: "Invalid Token"});
                }else{
                    next();
                }
            }catch(error){
                res.status(401);
                throw new Error("Not Authorized, token failed"); 
            }
        }
        else{
            res.status(401);
            throw new Error("Not authorized, Token not found");
        }
    }
});
module.exports = {protect};