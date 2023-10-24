const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
mongoose.connect(DATABASE_URL);
mongoose.connection
	.on("open", () => console.log("You are connected to mongoose"))
	.on("close", () => console.log("You are disconnected from mongoose"))
	.on("error", (err) => console.log(err));
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});
const User = mongoose.model("User", userSchema);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
	res.send("hello world");
});
// User Registration Route
app.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 6);
		const newUser = await User.create({ username, password: hashedPassword });
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json(error);
	}
});
// User Login Route
app.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username })
		if (!user) {
			res
				.status(401)
				.json({ message: "Authentication failed. User not found." })
			return;
		}
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (passwordMatch) {
			res.status(200).json({ message: "Authentication successful", user })
		} else {
			res
				.status(401)
				.json({ message: "Authentication failed. Password incorrect." })
		}
	} catch (error) {
		res.status(500).json(error);
	}
});
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));