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
const Recipe = require('./models/Recipe');
const Family = require('./models/Family');

const userController = require('./controllers/users');
const recipeController = require('./controllers/recipes');
const familyController = require('./controllers/families');




/////////////////////////////////////////////////////////////////////////////
//                          Middleware
/////////////////////////////////////////////////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

app.use('/users', userController);
app.use('/recipes', recipeController);
app.use('/families', familyController);

/////////////////////////////////////////////////////////////////////////////
//                          Routes
/////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("hello world");
  });

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
