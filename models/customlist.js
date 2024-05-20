const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true
    },
    customproperties:[{
        title:{
            type : String,
            required : true
        },
        defaultValue:{
            type : String,
            required : true
        },
    }],

    userID :{
        type :[{ type: mongoose.Types.ObjectId, ref: "UserSchema" }]
    }
    
    },  {timestamps : true}
)

module.exports = mongoose.model("CustomProperties", listSchema);