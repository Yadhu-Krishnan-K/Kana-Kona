import User from '../models/user.model.js'
import generateToken from '../lib/utils.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
import { sendEmail } from '../lib/createTransporter.js'
import { generateOtp } from '../lib/otpGenerator.js'
import Otp from '../models/otp.model.js'


const signup = async (req, res) => {

    try {
        let { fullName, email, password } = req.body
        if (!email || !password || !fullName) return res.status(400).json({ message: 'All fields are required' })

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters" })

        const existingUser = await User.findOne({$or: [
            {email},
            {name: fullName}
        ]})
        if (existingUser && existingUser.isVerified) return res.status(400).json({ message: 'User with same name or email already registered' })

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let user;

        if (!existingUser) {
            user = await User.create({
                name: fullName,
                email,
                password: hash,
                isVerified: false
            });
        } else {
            user = existingUser;
        }



        const genOtp = generateOtp();

        // remove old OTP if exists
        await Otp.deleteMany({ email, page:'signup' });

        // save new OTP
        await Otp.create({
            email,
            otp: genOtp,
            page: 'signup',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail({
            subject: "Verification for KANA-KONA",
            text: `Your otp for verification to use KANA-KONA : ${genOtp}`,
            to: email,
            from: process.env.EMAIL
        })
        res.status(200).json({ success: true, message: "Otp sent" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }

}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await Otp.findOne({ email, page: 'signup' });

        if (!record || record.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ⛔ TTL might not delete immediately → manually check expiry
        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const user = await User.findOne({ email });

        user.isVerified = true;
        await user.save();

        // cleanup OTP manually (optional but good)
        await Otp.deleteMany({ email, page: "signup" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            userName: user.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Already verified" });
        }

        const otp = generateOtp();

        await Otp.deleteMany({ email });

        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail({
            subject: "Resend OTP",
            text: `Your OTP: ${otp}`,
            to: email,
            from: process.env.EMAIL
        });

        res.status(200).json({ message: "OTP resent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            const match = bcrypt.compareSync(password, user.password)
            if (match) {
                generateToken(user._id, res)
                res.status(200).json({
                    _id: user._id,
                    email: user.email,
                    userName: user.name,
                    profilePic: user.profileImage
                })
            } else {
                res.status(400).json({ message: "invalid password" })
            }
        } else {
            res.status(400).json({ message: "invalid email" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}

const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout successfull" })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: "Internal server error"
        })
    }
}

const forgotPasswordEmailVerification = async (req, res, next) => {
    try {
        console.log('test hit ....')
        const {email} = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return next(new Error('Invalid Email'))
        }

        const genOtp = generateOtp();

        // remove old OTP if exists
        await Otp.deleteMany({ email, page:'forgotPassword' });

        // save new OTP
        await Otp.create({
            email,
            otp: genOtp,
            page: 'forgotPassword',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail({
            subject: "Verification for KANA-KONA",
            text: `Your otp to change password : ${genOtp}`,
            to: email,
            from: process.env.EMAIL
        })

        res.status(200).json({ success: true, message: "Otp sent" })

    } catch (error) {
        next(error)
    }
}

const verifyOtpAndUpdatePassword = async (req, res, next) => {
    try {
        console.log("body = ",req.body)
        const {email, otp, password} = req.body;

        const record = await Otp.findOne({email, page:"forgotPassword"})
        if(record.otp!==otp) return next(new Error("Invalid OTP"))
        if (record.expiresAt < Date.now()) {
            next(new Error("Otp expired please resend your email"));
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const result = await User.updateOne({email},{$set:{password: hash}})
        
        await Otp.deleteMany({email, page: "forgotPassword"})

        return res.status(200).json({success:true, message:"Password updated successfully"})

    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        let imageUrl = null
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "profile" }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    })
                    .end(req.file.buffer);
            });


            imageUrl = result;
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkAuth = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        res.status(200).json(req.user);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export {
    signup,
    verifyOtp,
    resendOtp,
    login,
    forgotPasswordEmailVerification,
    verifyOtpAndUpdatePassword,
    logout,
    updateProfile,
    checkAuth
}