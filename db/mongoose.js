const mongoose= require('mongoose')
mongoose.set('strictQuery', true)

  
mongoose.connect(process.env.DBURL,
{
   useNewUrlParser : true,
  
}).then(()=>{
    console.log("DataBase Connected")
}).catch((err)=>{
    console.log(err)
})