import mongoose, { models } from "mongoose";

const userCollection = new mongoose.Schema({
    username: {type: String , unique: true},
    clerk_id:{type: String, unique:true , required:true},
    email: {type: String},
    authenticated: {type: Boolean, default:false},
    polls_created: [{type: mongoose.Schema.Types.ObjectId , ref: "Poll"}],
    polls_voted:[ {type: mongoose.Schema.Types.ObjectId , ref: "Poll"}]
} , {timestamps: true})

const User = models.User || mongoose.model("User", userCollection, "User")

export default User