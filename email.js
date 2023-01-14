const nodemailer = require('nodemailer')

const mailer = (Newmail) => {
const transporter = nodemailer.createTransport({

        service: "hotmail",
        auth:{
            user : "mujeebqayoom@outlook.com",
            pass : "@M01942406085"    
        },
       tls: {
               rejectUnauthorized :false
            }
    });

const options = {
    from : "mujeebqayoom@outlook.com",
    to : Newmail,
    subject: "Task Manager App",
    text : "welcome to our website, stay tuned with us "
}

transporter.sendMail(options,(err,info)=>{

    if(err){
        return console.log(err);
    }

    console.log(info.response);
})

}


const deletionMailer = (mail)=>{


    const transporter = nodemailer.createTransport({

        service: "hotmail",
        auth:{
            user : "mujeebqayoom@outlook.com",
            pass : "@M01942406085"    
        },
       tls: {
               rejectUnauthorized :false
            }
    });


    const options = {
        from : "mujeebqayoom@outlook.com",
        to : mail,
        subject: "Task Manager App",
        text : "your account has been deleted"
    }
    
    transporter.sendMail(options,(err,info)=>{
    
        if(err){
            return console.log(err);
        }
    
        console.log(info.response);
    })
    
    }







module.exports = mailer
