/////////////////////////////////
// DEPENDENCIES 
////////////////////////////////
// get .env variables 
require("dotenv").config(); 
// pull PORT from .env, give default value of 3000 
// if the PORT does NOT exist 
// const { DATABASE_URL, PORT = 3000 } = process.env
const { DATABASE_URL, PORT = 4000 } = process.env
// import express 
const express = require('express')
const bcrypt = require("bcrypt")
// create application object 
const app = express() 
// import mongoose 
const mongoose = require('mongoose')
// import middleware
const cors = require('cors')
const morgan = require('morgan')
const Vehicle = require('./models/vehicles')
const Users = require('./models/user')

////////////////////////////////
// DATABASE CONNECTION 
////////////////////////////////
mongoose.connect(DATABASE_URL) // we do not need to pass options? 

mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected to mongoose'))
    .on('error', (err) => console.log(err))

////////////////////////////////
// MIDDLEWARE
////////////////////////////////
app.use(cors('*'))
app.use(morgan('dev'))
app.use(express.json())

////////////////////////////////
// ROUTES 
////////////////////////////////
// create a test route 
app.get('/', (req, res) => {
    res.send("hello world")
})

app.get("/user", async (req, res) => {
    try {
        // send all vehicle 
        res.json(await User.find({}))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
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

// USER CREATE ROUTE 
app.post("/vehicle/register", async (req, res) => {
	try {
		const { username, password } = req.body
		const hashedPassword = await bcrypt.hash(password, 6)
		const newUser = await Users.create({ username, password: hashedPassword })
		res.status(201).json(newUser)
	} catch (error) {
        console.log('Registration error', error)
		res.status(400).json(error)
	}
})

app.post('/vehicle/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const foundUser = await Users.findOne({ username })

        if (foundUser) {
            const isAMatch = bcrypt.compareSync(password, foundUser.password)
            if (isAMatch) {
                console.log('Login successful')
                res.json({ message: 'Login successful' })
            } else {
                res.status(401).json({ message: 'Invalid credentials' })
            }
        } else {
            res.status(401).json({ message: 'User not found' })
        }
    } catch (error) {
        console.error('Login error', error)
        res.status(500).json({ message: 'An error occurred' })
    }
});

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
