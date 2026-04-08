import mongoose, { model, Schema } from 'mongoose'

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profileImage: {
            type: String,
            default: ""
        },
        isVerified: {
            type: Boolean,
        }
    },
    {timestamps:true}
)

const UserModel = model('User', userSchema)

export default UserModel