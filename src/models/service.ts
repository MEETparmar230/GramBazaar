import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    imageId:{
        type:String,
        required:true
    }
})

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service