import mongoose from "mongoose";



const userSchema = new mongoose.Schema(
{
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    phone:String,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }      
},{timestamps:true}
)


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
