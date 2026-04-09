import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectRoute = async(req,res,next) => {
    try {        
        console.log('req.cookies🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 = ',req.cookies)
        const token = req.cookies.token;
        console.log('token ====== ',token)
    
        if(!token)return res.status(401).json({success:false,message:"Unauthorized-no token detected"})
            
        console.log('return not worked...')

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
        if(!decoded){
            return res.status(400).json({message:"Unauthorized-Invalid token"})
        }

        const userId = decoded.userId
        const user = await User.findById(userId).select("-password")
        console.log('user from auth.middleware = ',user)
        req.user = user        

        next()
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export default protectRoute