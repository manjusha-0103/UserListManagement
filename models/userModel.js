const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    [{ 
        email : {
            type : String,
            required : true ,
            unique : true
        },
        name: { 
            type: String, 
            required: true, 
        },
        // listSchemaId :{
        //     type : [{ type: mongoose.Types.ObjectId, ref: "CustomProperties" }]
        // },
        customProperties : {
            type : Map,
            of : String,
            required : true
        }, 
        unsubscribe : {
            type: Boolean,
            default : false
        }
    
    }],
    {timestamps : true}
)

module.exports = mongoose.model("UserSchema", userSchema);