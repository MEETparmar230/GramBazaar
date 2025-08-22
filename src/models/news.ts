import mongoose from 'mongoose'


const newsShema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    link:String
})


export default mongoose.models.News || mongoose.model("News",newsShema)