const mongoose  = require("mongoose")
const validator =require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Task =require('./task')

const UserSchema = new mongoose.Schema ({

    username : {
       type : String,
      required : true,
       trim : true,
      },

    email :  {
        type : String,
        required :true,
        trim : true,
        unique : true,
        validate(value) {
        if(!validator.isEmail(value)){
            throw new Error("invalid Email")
            }
        }
     },

     birthday: {
        type:String,
        trim : true,
     },

     password :{
        type : String,
        required :true,
        minlength : 3,
     },
     
     gender :{
        type :String,
     },

     phone :{
          type :Number,
          required :true,
          trim : true,
          unique : true,
     },

     tokens :[
        {
        token :{
            type:String,
            required:true,
          }
        }   
     ],
})

UserSchema.virtual('tasks',{
   ref:'Tasks',
   localField: '_id',
   foreignField: 'author'
})

UserSchema.statics.findByCred = async (email,password)=>{

    const user = await User.findOne({email:email})
    console.log("user in the middleware",user)
    if(!user)
    return undefined;
     
    const Dpassword = await bcrypt.compare(password,user.password)
    console.log("Decrypt password  ",Dpassword)
    if(!Dpassword)
    return Dpassword;

    return user;
}

UserSchema.methods.generateToken = async function() {

    const user = this

    const newtoken = jwt.sign({_id :user._id.toString()},process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({token:newtoken})
    await user.save();
    return newtoken;

}




UserSchema.pre('save', async function(next){
  const user =this

  console.log("middleware called");
  if(user.isDirectModified('password')){

  user.password = await bcrypt.hash(user.password,8);
  } 
  next()
})

const User = mongoose.model('User',UserSchema);

module.exports = User;