const mongoose = require('mongoose');

const uri = process.env.MONG_URI
// Connect to MongoDB

const connectToDB = ()=>{
  
    mongoose.connect(uri);
    console.log('Connected to MongoDB');

}

module.exports = connectToDB;