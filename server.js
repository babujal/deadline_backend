/////////////////////////////////
// DEPENDENCIES 
////////////////////////////////
// get .env variables 
require("dotenv").config(); 
// pull PORT from .env, give default value of 3000 
// if the PORT does NOT exist 
const { DATABASE_URL, PORT = 3000 } = process.env
// import express 
const express = require('express')
// create application object 
const app = express() 
// import mongoose 
const mongoose = require('mongoose')
// import middleware
const cors = require('cors')
const morgan = require('morgan')

////////////////////////////////
// DATABASE CONNECTION 
////////////////////////////////
mongoose.connect(DATABASE_URL) // we do not need to pass options? 

mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected to mongoose'))
    .on('error', (err) => console.log(err))

////////////////////////////////
// MODELS 
////////////////////////////////
const vehicleSchema = new mongoose.Schema({
    vehicle_make: {
        type: String,
        required: true
    },
    issue_description: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: 'needs reapirs'
    },
    comments: {
        type: String,
        default: ''
    },
    time_stamp: {
        type: Date,
        default: Date.now
    }
})

const Vehicle = mongoose.model("Vehicle", vehicleSchema)

////////////////////////////////
// MIDDLEWARE
////////////////////////////////
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

////////////////////////////////
// ROUTES 
////////////////////////////////
// create a test route 
app.get('/', (req, res) => {
    res.send("hello world")
})

// VEHICLE INDEX ROUTE
app.get("/vehicle", async (req, res) => {
    try {
        // send all vehicle 
        res.json(await Vehicle.find({}))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// VEHICLE CREATE ROUTE 
app.post("/vehicle", async (req, res) => {
    try {
        // create a vehicle 
        res.json(await Vehicle.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// VEHICLE UPDATE ROUTE 
app.put("/vehicle/:id", async (req, res) => {
    try {
        res.json(await Vehicle.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// VEHICLE DESTROY ROUTE 
app.delete("/vehicle/:id", async (req, res) => {
    try {
        res.json(await Vehicle.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.send(400).json(error)        
    }
})



////////////////////////////////
// LISTENER 
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))

// [{
//     "vehicle_make":"Honda",
//     "issue_description": "Interior lights, probably dirty contacs"
// }]
