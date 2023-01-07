const jwt = require('jsonwebtoken');
const asyncHandler=require("express-async-handler");
const pool = require('../config/db');

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
                check = `select * from user where id=${decoded.id}`;
                console.log(decoded.id)
                const [val,_] = await pool.execute(check);
                console.log(val);
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