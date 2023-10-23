const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter a username"],
        unique: [true, "Username already exists"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        unique: false,
    }
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);