//Hannah Huang
//this is just basic code to connect 
//once there's an actual collection to work with I can try and figure out how to add stuff to it but there's just a lot to making the collection

const express = require('express')
const mongoose = require('mongoose')
const app = express();

const uri = 'mongodb+srv://HannahH:1_meep-morp_1@gamedb.r0fulcn.mongodb.net/?appName=GameDB'

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error(error);
    }
}

connect();

app.listen(8000, () => {
    console.log("Server started on port 8000");
});

