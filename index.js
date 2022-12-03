import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import e from 'express';

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
// const connection = "mongodb://localhost:27017/smartTravellingDB"
const connection = "mongodb+srv://fyp2022:ptdmptdm5124@cluster0.sbe6i.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect( connection ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log("Database Connected Successfully"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    fName:String,
    lName:String,
    email:String,
    dob:String,
    password:String,
    pet:String

})
const carSchema = new mongoose.Schema({
    name:String,
    engine:String,
    rent:String,
  
  })
  const carBookSchema = new mongoose.Schema({
    origin:String,
    destination:String,
    days:String,
    email:String,
    name:String,
    engine:String,
    rent:String,
  
  })
  
  const tripSchema = new mongoose.Schema({
    name:String,
    description:String,
    place:String,
    date:String,
    seats:String,
    src:String,
    price:String
  
  })
  const tripBookSchema = new mongoose.Schema({
    email:String,
    name:String,
    place:String,
    date:String,
    seats:String
  
  })

const User = new mongoose.model('User', userSchema)

const Car = new mongoose.model('Car', carSchema)
const Trip = new mongoose.model('Trip', tripSchema)

const CarB = new mongoose.model('CarBook', carBookSchema)
const TripB = new mongoose.model('TripBook', tripBookSchema)

app.get('/home', (req, res) => {
    User.remove({}).then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})



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
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
    const {fName ,lName , email, dob , password,pet} = req.body
    console.log(req.body)
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
                password,
                pet
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
}
    
})


const port = process.env.PORT || 5002;
app.listen(port,()=>{
    console.log("BE started at port ",port);
})
