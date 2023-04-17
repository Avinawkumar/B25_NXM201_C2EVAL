const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');

const cookieParser = require('cookie-parser');
const connected_to_AtlasDb = require('./configs/db');
const user_Router = require('./routes/user.route');
const blogRouter = require('./routes/blogs.route');
const auth = require('./middlewares/authenticate.mw');


require("dotenv").config() // using .env for port and db
const app = express();
app.use(cors())
app.use(express.json()); // ==> important;
app.use(cookieParser())



app.get("/", (req,res) =>{
    res.send("Home page 201 c2 eval")
})

app.use("/users", user_Router )

app.use(auth)
app.use("/blogs", blogRouter)




// exporting the app
module.exports = app

app.listen(process.env.port , async() =>{
    try {
        await connected_to_AtlasDb
        console.log("connected to atlas_mongodb");
    } catch (error) {
        console.log("not connected to atlas_mongodb");
        console.log(error);
    }
    console.log(`Server is running on port ${process.env.port}`);
});