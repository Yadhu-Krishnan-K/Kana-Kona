import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectRoute = async(req,res,next) => {
    try {        
        console.log('req.cookies🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 = ',req.cookies)
        const token = req.cookies.token;
    
        if(!token)return res.status(400).json({message:"Unauthorized-no token detected"})
    
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
        if(!decoded){
            return res.status(400).json({message:"Unauthorized-Invalid token"})
        }

        const userId = decoded.userId
        const user = await User.findById(userId).select("-password")
        req.user = user        

        next()
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export default protectRoute