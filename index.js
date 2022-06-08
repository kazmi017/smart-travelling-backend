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
const notifSchema = new mongoose.Schema({
    name:String,
    description:String

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
const hotelSchema = new mongoose.Schema({
    name:String,
    rent:String,
    place:String,
    star:String,

})
const hotelBookSchema = new mongoose.Schema({
    email:String,
    location:String,
    rent:String,
    ina:String,
    out:String,
    rooms:String,
    type:String,
    name:String,
    date:String,

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

const soloSchema= new mongoose.Schema({
    origin:String,
    destination:String,
    days:String,
    email:String,
    carengine:String,
    carav:String,
    cartype:String,
    carname:String,
    fuelprice:String,
    breakfast:String,
    lunch:String,
    supper:String,
    dinner:String

})

const pointSchema= new mongoose.Schema({
    email:String,
    points:String
})

const User = new mongoose.model('User', userSchema)

const Car = new mongoose.model('Car', carSchema)
const Trip = new mongoose.model('Trip', tripSchema)
const Hotel = new mongoose.model('Hotel', hotelSchema)
const Notif = new mongoose.model('Notification', notifSchema)

const CarB = new mongoose.model('CarBook', carBookSchema)
const TripB = new mongoose.model('TripBook', tripBookSchema)
const HotelB = new mongoose.model('HotelBook', hotelBookSchema)
const Solo = new mongoose.model('SoloBook', soloSchema)

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

const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./images');
    },
    filename: function(req,file,cb){
        cb(null,uuidv4()+'-'+Date.now()+path.extname(file.originalname))
    }
});

const fileFilter=(req,file,cb)=>{
    const allowedFileTypes=['images/jpeg','images/jpg','images/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

const upload=multer({storage,fileFilter});

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
// TRIP
app.get("/Trip",(req,res)=>{
    Trip.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

app.post("/Trip",(req,res)=>{
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const {name,description,price,place,date,seats,src} = req.body 
        console.log(req.body)
    const trip = new Trip({
        name,
        description,
        price,
        place,
        date,
        seats,
        src
    })
    trip.save( err =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({
                message : "Successfully Created"
            })
        }
    })
    }


})

app.delete("/Trip",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            Trip.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})
// Notification
app.get("/Notif",(req,res)=>{
    Notif.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

app.post("/Notif",(req,res)=>{
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const {name,description} = req.body 
        console.log(req.body)
    const notif = new Notif({
        name,
        description
    })
    notif.save( err =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({
                message : "Successfully Created"
            })
        }
    })
    }


})
app.delete("/Notif",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            Notif.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})
//Car
app.get("/Car",(req,res)=>{
    Car.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

app.post("/Car",(req,res)=>{
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const {name,engine,rent} = req.body 
        console.log(req.body)
    const car = new Car({
        name,
        engine,
        rent
    })
    car.save( err =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({
                message : "Successfully Created"
            })
        }
    })
    }


})

app.delete("/Car",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            Car.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})

//Hotel
app.get("/Hotel",(req,res)=>{
    Hotel.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

app.post("/Hotel",(req,res)=>{
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const {name,rent,place,star} = req.body 
        console.log(req.body)
    const hotel = new Hotel({
        name,
        rent,
        place,
        star
    })
    hotel.save( err =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({
                message : "Successfully Created"
            })
        }
    })
    }


})
app.delete("/Hotel",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            Hotel.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})

//User
app.get("/User",(req,res)=>{
    User.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

//User Details
app.post("/UserDsT",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { email } = req.body

        TripB.find( {email: email},{}).then(function(results){
            res.send(results);
            console.log(results)
        }).catch(function(err){
            console.error(err);
        });

      }
})
app.post("/UserDsH",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { email } = req.body

        HotelB.find( {email: email},{}).then(function(results){
            res.send(results);
            console.log(results)
        }).catch(function(err){
            console.error(err);
        });

      }
})
app.post("/UserDsC",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { email } = req.body

        CarB.find( {email: email},{}).then(function(results){
            res.send(results);
            console.log(results)
        }).catch(function(err){
            console.error(err);
        });

      }
})

//Bookings
app.post("/TripBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { email,
            name,
            place,
            date,
            seats} = req.body
            const tB=new TripB({ 
                email,
                name,
                place,
                date,
                seats} )
            tB.save(err =>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send({
                        message : "Successfully Created"
                    })
            }
        })

      }
})
app.get("/TripBook",(req,res)=>{
    TripB.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})
app.delete("/TripBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            TripB.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})
app.put("/TripBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id,seats} = req.body
        var myquery = { _id: _id };
        var newvalues = { $set: {seats: seats} };
            Trip.updateOne(myquery, newvalues).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})

app.post("/CarBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { 
            origin,
            destination,
            days,
            email,
            name,
            engine,
            rent,
            
        } = req.body
            const cB=new CarB(
                { 
                    origin,
                    destination,
                    days,
                    email,
                    name,
                    engine,
                    rent,
                    
                }
             )
            cB.save(err =>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send({
                        message : "Successfully Created"
                    })
            }
        })

      }
})

app.get("/CarBook",(req,res)=>{
    CarB.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

app.delete("/CarBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            CarB.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})

app.post("/HotelBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { 
            email,
            location,
            rent,
            ina,
            out,
            rooms,
            type
            
        } = req.body
            const hB=new HotelB(
                { 
                    email,
                    location,
                    rent,
                    ina,
                    out,
                    rooms,
                    type
                    
                }
             )
            hB.save(err =>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send({
                        message : "Successfully Created"
                    })
            }
        })

      }
})

app.get("/HotelBook",(req,res)=>{
    HotelB.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})

app.delete("/HotelBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const { _id} = req.body
            HotelB.deleteOne({ '_id': _id }).then(function(results){
                res.send(results);
            }).catch(function(err){
                console.error(err);
            });
        

      }
})

app.post("/SoloBook",(req,res)=>{
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        res.send({
            message:"Data Required"
        })
      }else{
        const {
            origin,
            destination,
            days,
            email,
            carengine,
            carav,
            cartype,
            carname,
            fuelprice,
            breakfast,
            lunch,
            supper,
            dinner
        
        } = req.body
            const soloB=new Solo(
                {
                    origin,
                    destination,
                    days,
                    email,
                    carengine,
                    carav,
                    cartype,
                    carname,
                    fuelprice,
                    breakfast,
                    lunch,
                    supper,
                    dinner
                
                }
             )
            soloB.save(err =>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send({
                        message : "Successfully Created"
                    })
            }
        })

      }
})

app.get("/SoloBook",(req,res)=>{
    Solo.find().then(function(results){
        res.send(results);
    }).catch(function(err){
        console.error(err);
    });
})



const port = process.env.PORT || 5002;
app.listen(port,()=>{
    console.log("BE started at port ",port);
})
