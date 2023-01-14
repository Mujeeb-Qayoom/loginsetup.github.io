const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req,res,next) =>{

try{
    token = req.cookies.jwt;
    console.log(token);
    const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
    console.log(verifyUser._id);

    const user = await User.findOne({_id:verifyUser._id})

    req.user = user
    req.token = token
}

catch(err) 
    {
    res.status(403).send("Please Authenticate");
    }
    next();
}

module.exports =auth;