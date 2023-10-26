////////////////////////////////
// MODELS 
////////////////////////////////
const mongoose = require('mongoose')

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
        default: 'needsRepairs'
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

module.exports = Vehicle