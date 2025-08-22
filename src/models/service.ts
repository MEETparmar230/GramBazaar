import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
})

const Service = mongoose.model("Service",serviceSchema)

export default mongoose.models.service || Service