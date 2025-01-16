import mongoose, {Schema, model} from "mongoose";

const messageSchema = new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:String,
    image:String
},
{timestamps:true})

const messageModel = model("Message", messageSchema)

export default messageModel