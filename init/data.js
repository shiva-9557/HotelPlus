const mongoose = require("mongoose"); //requiring mondoose to use it 
const Listing = require("../models/listing.js");// we create schema in chat.js to reduce bulkeyness of code
const idata=require("./sampledata.js")

main().//making connection then we can use database-whatsapp but we can use dbs before connection made because mongoose uses operational buffer
    then(res => {
        console.log("connected to db");
    })
    .catch(err => {
        console.log("error occour while connetion");
    });

async function main() {
    return await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDB=async()=>{
    await Listing.deleteMany({});
    idata.data=idata.data.map((obj)=>({...obj,owner:"65b69d0f57fc89ac8a4e2785"}));
    await Listing.insertMany(idata.data);
}

initDB();

