import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/smartTravellingDB" ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    fName:String,
    lName:String,
    email:String,
    dob:Date,
    password:String

})

const User = new mongoose.model('User', userSchema)

app.get('/home', (req, res) => res.send('Hello world!'));

// Routes
app.post("/SignIn", (req , res )=>{
    const { email , password} = req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password === user.password){
                res.send({message:"Login Successful" , user:user})
            }
            else{
                res.send({message:"Password Doesn't match"})
            }
        }
        else{
            res.send({message:"User not Registered"})
        }
})
})

app.post("/SignUp", (req , res )=>{
    const {fName ,lName , email, dob , password} = req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User already Registered"})
        }
        else{
            const user = new User({
                fName,
                lName,
                email,
                dob,
                password 
            })
            user.save( err =>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send({
                        message : "Successfully Registered"
                    })
                }
            })
        }
    })
    
})

app.listen(9002,()=>{
    console.log("BE started at port 9002");
})

// app.js

// // const express = require('express');

// const app = express();

// app.get('/', (req, res) => res.send('Hello world!'));

// const port = process.env.PORT || 8082;

// app.listen(port, () => console.log(`Server running on port ${port}`));