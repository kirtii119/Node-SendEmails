const express = require("express") 
const authRouter = require('./router/auth.routes')
const emailRouter = require('./router/emailreply.routes')
const app = express()
const PORT = 3000

app.use(express.json())
 
// Receive all auth requests
app.use('/auth', authRouter)

//Send Emails
app.use('/email',emailRouter)

app.listen(PORT,(err)=>{
    if(!err){
        console.log("Running")
        setInterval(async()=>{
            const res = await fetch(`http://localhost:3000/email/sendemails`);
            console.log(res.status)
    }, (Math.floor((Math.random()*(120-45+1))+45))*1000)
    }
    else{
        console.log(err)
    }

})
