require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken')
const path =require('path')
const cookieParser = require('cookie-parser')
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task')
const auth =require('./middleware/auth');
const mailer = require('./email')


const port = process.env.PORT ||3000
const app = express()
const staticFIles =(path.join(__dirname,'/static'));
const viewFiles = (path.join(__dirname,'/templates/views'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true}))
app.use(express.static(staticFIles));
app.set('view engine','hbs');
app.set('views',viewFiles);


app.get('/login',(req,res)=>{
   res.render('login')
})

app.get('/register',(req,res)=>{
   res.render('signUp')
})

app.get("/about",auth, async(req,res)=>{

   res.render('about',{
   username : req.user.username,
   phone :req.user.phone,
   birthday :req.user.birthday});

})

app.post('/about', auth,async (req,res)=>{
    
   const author =req.user._id
   console.log(`this is author  ${author}`)
   const newTask = await new Task({
   ...req.body,
   author :author,
   })
   await newTask.save();
   res.render('about')
})    

app.get('/logout-all',auth, async (req,res)=>{
  
   // try{
    req.user.tokens =[]
    await req.user.save(); 
    res.render('login');
// }
// catch(err){
//    res.status(500).send(err);
// }
})

app.get('/logout',auth,async (req,res)=>{

  try{

   req.user.tokens = req.user.tokens.filter((currentelement)=>{
   return currentelement.token !== req.token });      
   res.clearCookie('jwt');
   console.log("logout sucessfully");
   await req.user.save();
   res.render('login');
   }
  catch(err){
   res.send(err)
   }
})

app.post('/login',async(req,res)=>{
  
  try{
   console.log(req.body);
   const user = await User.findByCred(req.body.email,req.body.password)
   const token = await user.generateToken();
   res.cookie('jwt',token,{
   expiresIn : 30000,
   httpOnly :true
  });
   if(!user){
      res.send("invalid Credentials");
   }
      res.status(200).send(user); 
   }

  catch(err){
   res.status(404).send("user not found");
  }
})

app.get('/signUp',(req,res)=>{
   
   res.render('signUp') ;
})

app.post('/signUp',async(req,res)=>{
 
  if(req.body.password === req.body.password2){
   const newUser = await new User(req.body)
   const token = await newUser.generateToken();
   res.cookie('jwt',token,{
   expiresIn : 30000,
   httpOnly :true
   });
   await newUser.save();
   mailer(req.body.email);
   res.send({newUser,token});
  }
  else{
   res.send("reenter the password");
  }

})

app.get('/mytasks',auth,(req,res)=>{

})

app.listen(port,()=>{
   console.log(`listening to the port ${port}`);
})

