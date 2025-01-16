import mongoose, { mongo } from 'mongoose'

const connectDB = ()=>{
   const url = process.env.MONGODB_URL
    try{
        mongoose.connect(url)
        .then((conn)=>{
            console.log(`MongoDB Connected: ${conn.connection.host}`)
            console.log('server running on http://localhost:5001');  
        })
        .catch((err)=>{
            throw err
        })
    }catch(err){
        console.error(`Error: ${err.message}`);
    }
}

export default connectDB