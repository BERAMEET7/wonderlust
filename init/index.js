const mongoose = require("mongoose");
const initdata = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to database");
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(MONGO_URL);
}

let initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner:"65f48ee3fac4a624abf37469"}));
    await Listing.insertMany(initdata.data);
    console.log("data is initialized");
}

initDB();