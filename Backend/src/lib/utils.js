import jwt from 'jsonwebtoken'

const generateToken =(userId,res)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined")
    }
    const secret = process.env.JWT_SECRET
    const token = jwt.sign({userId},secret,{
        expiresIn:"7d"
    })
    res.cookie("token", token, {
        maxAge:1000 * 60 * 60 * 24 * 7, //7days in ms
        httpOnly:true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure:process.env.NODE_ENV!=="development"
    });
    return token
}

export default generateToken