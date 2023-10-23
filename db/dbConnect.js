require("dotenv").config();
const mongoose = require("mongoose");

async function dbConnect() { // this function is used to connect to the database
	mongoose
		.connect(process.env.DB_URL, {
			//   these are options to ensure that the connection is done properly
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => {
			console.log("Successfully connected to MongoDB Atlas!");
		})
		.catch((error) => {
			console.log("Unable to connect to MongoDB Atlas!");
			console.error(error);
		});
}

module.exports = dbConnect;
