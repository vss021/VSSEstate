import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    avatar : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
    }
}, {timestamps : true});


const User = mongoose.model('User', userSchema);

export default User;

