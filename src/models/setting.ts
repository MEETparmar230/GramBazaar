import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    logo:{
        type:String
    },
    name:{
        type:String,
        required:true
    }

})

const setting  = mongoose.models.Setting || mongoose.model("Setting",settingSchema)

export default setting