import User from '../models/user.model.js'
import generateToken from '../lib/utils.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

const signup = async (req, res) => {

    try {
        let { fullName, email, password } = req.body
        if (!email || !password || !fullName) return res.status(400).json({ message: 'All fields are required' })

        if (password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters" })

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: 'Email already registered' })

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            name: fullName,
            email,
            password: hash,
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                userName: newUser.name,
                profilePic: newUser.profileImage
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
        console.clear()
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }

}

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
    login,
    logout,
    updateProfile,
    checkAuth
}