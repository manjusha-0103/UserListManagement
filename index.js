const express = require("express");
const connectDB = require("./database/db")
require('dotenv').config()
const bodyParser= require("body-parser")
const fs = require('fs');

const app = express()

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/", require("./routes/userListRoute"));
connectDB()

app.listen(port, ()=>{
    console.log(`servere started on port ${port}`)
})
