const mongoose = require('mongoose');

require('dotenv').config()


MONGO_URI = process.env.MONGO_URI;
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(MONGO_URI,
        {   useNewUrlParser : true,
            useUnifiedTopology :true
        })
        console.log(`mongodb connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log(error);
        process.exit(1)
    }
}
module.exports = connectDB
