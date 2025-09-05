import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    message:{
        type:String,
        required:true
    },
},
{timestamps:true})

const Message = mongoose.models.Message || mongoose.model("Message",messageSchema)

export default Message