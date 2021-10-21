require('dotenv').config();
const express = require('express');
const app = express();
const {PORT=4000, MONGODB_URL} = process.env;

const mongoose = require("mongoose");

const cors = require("cors");
const morgan = require("morgan");


mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

const User = require('./models/User');

const userController = require('./controllers/users');




/////////////////////////////////////////////////////////////////////////////
//                          Middleware
/////////////////////////////////////////////////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

app.use('/users', userController);
/////////////////////////////////////////////////////////////////////////////
//                          Routes
/////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("hello world");
  });

// PEOPLE INDEX ROUTE
// app.get("/people", async (req, res) => {
//     try {
//       // send all people
//       res.json(await People.find({}));
//     } catch (error) {
//       //send error
//       res.status(400).json(error);
//     }
//   });



app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
