
const asyncHandler = require('express-async-handler');
const listSchema = require("../models/customlist")
const User = require("../models/userModel")
const fs = require("fs")
const fastCsv = require("fast-csv")
const SendEmail = require("../utility/emailManager")


const addConstomFields = async(req,res)=>{
    try{
        // console.log(req)
        const {title, customproperties} = req.body;
        const list = new listSchema({title,customproperties})
        const savedlist = await list.save();

        if(savedlist){
            res.status(201).send({
                success : true,
                data : savedlist,
                message : "All custom properties saved successfully"
            })
        }
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// const parseCsv = asyncHandler(async(req,res)=>{
//     try{

//     }
//     catch(e){
//         console.log(e)
//     }
// })

const handleCsvFile = async(req,res)=>{
    try{
        const file = req.file;
        console.log(file)

        const options = {
            objectMode: true,
            delimiter: ",",
            quote: null,
            headers: true,
            renameHeaders: false,
            trim: true,
        };

        // const users = [];
        // const errors = [];
        // let successCount = 0;

        console.log(req.params)
        const listid = req.params.listid;
        const list =  await listSchema.findById(listid);

        if (!list){
            throw new Error('List not found');
        }

        const customPropsMap = list.customproperties.reduce((acc, prop) => {
            acc[prop.title] = prop.defaultValue;
            return acc;
        }, {});
        console.log(customPropsMap)
        
        let success = 0;
        let total = 0;
        const errorlist = [];
        const userList = [];
    
        const stream = fs.createReadStream(file.path).pipe(fastCsv.parse(options));

        stream
            .on("data", async (row) => {
                stream.pause(); // Pause the stream to handle async operations

                const { Email, Name, ...customProps } = row;
                console.log(Email, Name, customProps);

                const customprops = {};
                for (const key in customPropsMap) {
                    customprops[key] = customProps[key] || customPropsMap[key];
                }
                userList.push({ Name, Email, listid, customprops });

                try {
                    const _user = await User.create({ name: Name, email: Email, customProperties: customprops });
                    list.userID.push(_user._id); // Add user ID to list
                    success++;
                } catch (e) {
                    errorlist.push(e);
                }

                stream.resume(); // Resume the stream after async operation
            })
            .on("end", async (rowcount) => {
                await list.save(); // Save the list with updated user IDs
                total = rowcount; // Set the total count of processed rows
                console.log(errorlist);
                res.status(201).send({
                    success: true,
                    useraddcount: success,
                    errorCount: errorlist.length,
                    errorlist,
                    totaluser: total,
                });
            })
            .on("error", (error) => {
                console.log("error : ");
                console.log(error);
                errorlist.push(error);
                res.status(500).json({ error: error.message });
            });   
            // await sendBulkmails(req,res,listid)    

    }
    catch(error){
        res.status(500).json({ error: error.message });
        console.log(error)
    }
}

const sendBulkmails = async(req,res)=>{
    try{
        const users = await User.find()
        // console.log(users)
        if(users){
            for(const user of users){
                const subject = `MathonGo||test email`
                const text = `Activity Update with MathonGo`
                if (user.unsubscribed){ return;}
                await SendEmail(user, subject, text)
                // console.log(user.email)
            }
        
            res.status(200).send({
                success: true,
                message : "All Emails send successfully"
            })
        }
        else {
            res.status(200).send({
                success: false,
                message : "Unsuccefull"
            })
        }
    }
    catch(error){
        res.status(500).json({ error: error.message });
        
    }
}

const umsubscribesdUser = async(req,res)=>{
    try{
        const userId = req.params.userid;
        const uesrupdate = await User.findByIdAndUpdate({_id:userId},{unsubscribe:true},{new: true})
        if(uesrupdate){
            res.status(200).json({
                success: true,
                message : "You have unsubscribed. You will no longer receive from MathonGo"
            })
            console.log("You have unsubscribed. You will no longer receive from MathonGo")
        }
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports={
    handleCsvFile,
    addConstomFields,
    umsubscribesdUser,
    sendBulkmails   
}