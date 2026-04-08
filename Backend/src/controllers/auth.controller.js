import User from '../models/user.model.js'
import generateToken from '../lib/utils.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
// import { sendEmail } from '../lib/sendEmail.js'
import { generateOtp } from '../lib/otpGenerator.js'
import Otp from '../models/otp.model.js'
// import { success } from 'zod'


const signup = async (req, res, next) => {

    try {
        let { fullName, password } = req.body
        if (!password || !fullName) return res.status(400).json({ message: 'All fields are required' })

        const existingUser = await User.findOne({
            name: fullName
        })
        if (existingUser && existingUser.isVerified) return res.status(400).json({ message: 'User with same name or email already registered' })

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let user;

        if (!existingUser) {
            user = await User.create({
                name: fullName,
                password: hash,
                isVerified: false,
            });
        } else {
            user = existingUser;
        }



        const genOtp = generateOtp();

        // remove old OTP if exists
        await Otp.deleteMany({ name:fullName, page: 'signup' });

        // save new OTP
        await Otp.create({
            name:fullName,
            otp: genOtp,
            page: 'signup',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        //cant use any email service without payment. especiallly node mailer doesnt support on render

        // let {data, error} = await sendEmail({
        //     subject: "Verification for KANA-KONA",
        //     html: `<strong>Your otp for registering to Kana-Kona : ${genOtp}</strong>`,
        //     to: email,
        //     from: "onboarding@resend.dev"
        // })
        // console.log(`data = ${data}, \n error = ${error}`)
        // if(error){

        //     return res.status(500).json({success: false, message: "error sending otp..."})
        // }
        res.status(200).json({ success: true, message: "Otp sent", otp:genOtp })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }

}

const verifyOtp = async (req, res) => {
    try {
        const { name, otp } = req.body;
        console.log('otp======', otp)
        console.log('name====', name)
        const record = await Otp.findOne({ name, page: 'signup' });
        console.log("record========", record)

        if (!record || record.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ⛔ TTL might not delete immediately → manually check expiry
        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const user = await User.findOneAndUpdate(
            { name },
            { $set: { isVerified: true } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('updated user = ', user)

        // cleanup OTP manually (optional but good)
        await Otp.deleteMany({ name, page: "signup" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            userName: user.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const resendOtp = async (req, res) => {
    try {
        const { name } = req.body;

        const user = await User.findOne({ name });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Already verified" });
        }

        const otp = generateOtp();

        await Otp.deleteMany({ name });

        await Otp.create({
            name,
            otp,
            page: 'signup',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        console.log('your otp is sending.......');
        

        // let {data, error} = await sendEmail({
        //     subject: "Resend OTP",
        //     html: `<strong>Your otp for registering to Kana-Kona : ${otp}</strong>`,
        //     to: email,
        //     from: "onboarding@resend.dev"
        // });
        // console.log(`data = ${data}, \n error = ${error}`)
        // if(error){

        //    return res.status(500).json({success: false, message: "error sending otp..."})
        // }

        res.status(200).json({ success: true, message: "OTP resent", otp });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const login = async (req, res) => {
    try {
        const { name, password } = req.body
        const user = await User.findOne({ name })
        if(!user)return res.status(404).json({success: false, message:"User not found"})
        if (!user.isVerified) return res.status(400).json({ success: false, message: "Complete the signup procedures..." })
        if (user) {
            const match = bcrypt.compareSync(password, user.password)
            if (match) {
                generateToken(user._id, res)
                res.status(200).json({
                    success: true,
                    authUser: {
                        _id: user._id,
                        userName: user.name,
                        profilePic: user.profileImage
                    }
                })
            } else {
                res.status(400).json({ message: "invalid password" })
            }
        } else {
            res.status(400).json({ message: "invalid user name" })
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
        const { email } = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return next(new Error('Invalid Email'))
        }

        const genOtp = generateOtp();

        // remove old OTP if exists
        await Otp.deleteMany({ email, page: 'forgotPassword' });

        // save new OTP
        await Otp.create({
            email,
            otp: genOtp,
            page: 'forgotPassword',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        let {data, error} = await sendEmail({
            subject: "For changing password",
            html: `<Strong>Your otp to change password : ${genOtp}</Strong>`,
            to: email,
            from: "onboarding@resend.dev"
        })
        console.log(`data = ${data}, \n error = ${error}`)
        if(error){

         return res.status(500).json({success: false, message: "error sending otp..."})
        }

        res.status(200).json({ success: true, message: "Otp sent" })

    } catch (error) {
        next(error)
    }
}

const verifyOtpAndUpdatePassword = async (req, res, next) => {
    try {
        console.log("body = ", req.body)
        const { email, otp, password } = req.body;

        const record = await Otp.findOne({ email, page: "forgotPassword" })
        if (record.otp !== otp) return next(new Error("Invalid OTP"))
        if (record.expiresAt < Date.now()) {
            next(new Error("Otp expired please resend your email"));
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const result = await User.updateOne({ email }, { $set: { password: hash } })

        await Otp.deleteMany({ email, page: "forgotPassword" })

        return res.status(200).json({ success: true, message: "Password updated successfully" })

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
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })
        res.status(200).json({ success: true, user: req.user });

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