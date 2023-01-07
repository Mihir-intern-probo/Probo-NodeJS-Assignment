const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const {User} = require("../models/userModel");
const pool = require("../config/db");
const assert = require('assert');

const checkEmail = (email)=>{
        var emailFormat =  /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (email !== '' && email.match(emailFormat))
            return false; 
        return true;
}

checkphoneNumber = (phoneNumber)=>{
    if(phoneNumber !== '' && phoneNumber>=1000000000 && phoneNumber<=9999999999)
        return false;
    return true;
}

const createUser = asyncHandler(async(req,res)=>{
    let data = new User(req.body.first_name,req.body.last_name,req.body.email,req.body.mobile,req.body.pic);
    try{
        let sql = `select * from user where email = '${req.body.email}'`;
        const [user, _] = await pool.execute(sql);
        if(!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.mobile || !req.body.pic){
            res.status(204).json({message: "Please fill all the fields"});
        }else if(user.length>0){
            res.status(409).json({message: "User already exists"});
        } 
        else if(checkEmail(req.body.email)){
            res.status(400).json({message: "Invalid email"});
        }
        else if(checkphoneNumber(req.body.mobile)){
            res.status(400).json({message: "Invalid phone number"});
        }else{
            let user1 = await data.save();
            res.status(200).json({"firstName":req.body.first_name,
            "lastName":req.body.last_name,    
            "email":req.body.email,
            "mobile":req.body.mobile,
            "pic":req.body.pic,
            "token": generateToken(user1),
            "message": "User created"});
        }
    }catch(err)
    {
        res.status(500).json({message: "Something went wrong"});
    }
});

const getUsers = asyncHandler(async(req,res)=>{
    let offValue = req.query.page;
    let val = req.query.limit;
    let sql = `select * from user limit ${val} offset ${(offValue-1)*2}`;
    try{
        const [users, _] = await pool.execute(sql);
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: "Something went wrong"});
    } 
});

const updateUser = asyncHandler(async(req,res)=>{
    req.params.id = parseInt(req.params.id)
    var id = req.params.id;
    assert(!isNaN(id), 'id should be a number');
    assert(typeof id === 'number', 'id must be a number');
    let check = `select * from user where id = ${id}`;
    const [val,_] = await pool.execute(check);
    if(val.length==0)
    {
        res.status(404).json({message: "User not found"});
    }else{
        let sql = `update user set first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', email = '${req.body.email}', mobile = ${req.body.mobile}, pic = '${req.body.pic}' where id = ${req.params.id}`;
        try{
            if(checkEmail(req.body.email)){
                res.status(400).json({message: "Invalid email"});
            }else if(checkphoneNumber(req.body.mobile)){
                res.status(400).json({message: "Invalid phone number"});
            }else{
                const [users, _] = await pool.execute(sql);
                res.status(200).json({"firstName":req.body.first_name,
                "lastName":req.body.last_name,    
                "email":req.body.email,
                "mobile":req.body.mobile,
                "pic":req.body.pic,
                "message": "User updated"});
            }
        }catch(err){
            res.status(500).json({message: `${err}`});
        }
    }
})

const deleteUser = asyncHandler(async(req,res)=>{
    req.params.id = parseInt(req.params.id)
    var id = req.params.id;
    assert(!isNaN(id), 'id should be a number');
    assert(typeof id === 'number', 'id must be a number');
    let check = `select * from user where id = ${id}`;
    const [val,_] = await pool.execute(check);
    if(val.length==0)
    {
        res.status(404).json({message: "User not found"});
    }else{
        let sql = `delete from user where id = ${req.params.id}`;
        try{
            const [users, _] = await pool.execute(sql);
            console.log(users);
            res.status(200).json({"message":"User deleted"});
        }catch(err){
            res.status(500).json({message: `${err}`});
        }
    }
})

module.exports = {createUser,getUsers,updateUser,deleteUser};