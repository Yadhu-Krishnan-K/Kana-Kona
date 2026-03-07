import cloudinary from '../lib/cloudinary.js'

import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketIds, io } from '../lib/socket.io.js'


const getUsersSidbar =async(req,res)=>{
    try {
        let current_userId = req.user._id
        let list = await User.find({_id:{$ne:current_userId}}).select("-password")
        res.status(200).json(list)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or:[
                {senderId:myId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}

const sendMessage=async(req,res)=>{
    try {
        const {text,image} = req.body
        const {id:recieverId} = req.params
        const senderId = req.user._id
    
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
    
        const newMessage = new Message({
            senderId,
            recieverId,
            image:imageUrl,
            text
        })
        await newMessage.save()
    
        //apply socket.io here
        console.log('new message = ',newMessage)
        const receiverSocketIds = getReceiverSocketIds(recieverId);
        console.log('recieverSocketId ==== ',receiverSocketIds)
        if(receiverSocketIds){
            receiverSocketIds.forEach((socketId) => {
                io.to(socketId).emit("newMessage", newMessage);
            });
        }
        
        res.status(200).json(newMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"}) 
    }

}


export {
    getUsersSidbar,
    getMessages,
    sendMessage
}