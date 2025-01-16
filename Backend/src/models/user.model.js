import mongoose, { model, Schema } from 'mongoose'

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
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
    },
    {timestamps:true}
)

const UserModel = model('User', userSchema)

export default UserModel