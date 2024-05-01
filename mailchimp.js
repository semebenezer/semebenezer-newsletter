require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const https = require("https")



app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))


app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/mailchimp.html")
   

})
app.post("/",(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

   

    const data = {
        "members":[
            {
               "email_address" : email,
               "status": "subscribed",
               "merge_fields":{
                "FNAME": firstName,
                "LNAME": lastName
               }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = `https://us22.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`
    const options = {
        method: "POST",
        auth: process.env.MAILCHIMP_API
    }
    const requ = https.request(url, options, function(response){
       response.on("data", (d)=>{
       if(response.statusCode === 200){
            res.sendFile(__dirname + "/public/success.html")
       }else{
        res.sendFile(__dirname + "/public/failure.html")
       }
       }) 
    })


    requ.write(jsonData);
    requ.end();

})

app.post("/failure",(req,res)=>{
    res.redirect("/")
})



app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})