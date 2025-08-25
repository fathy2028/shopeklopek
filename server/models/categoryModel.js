import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    deliveryDuration:{
        type:Number,
        required:true,
        default:1440, // Default delivery duration in minutes (24 hours = 1440 minutes)
        min:30, // Minimum 30 minutes
        max:10080 // Maximum 7 days (168 hours = 10080 minutes)
    },
    photo:{
        data:Buffer,
        contentType:String
    }

})

export default mongoose.model("category",categorySchema);