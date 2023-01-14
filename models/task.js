const mongoose= require('mongoose');
const User =require('./user')

const taskSchema = new mongoose.Schema ({

    task :{
        type : String,
        
    },

    discription:{
        type : String,
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
      }
},{
    timestamps:true
})

const Task = mongoose.model('Task',taskSchema)

module.exports =Task;