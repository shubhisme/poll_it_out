import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String , unique: true , trim: true},
    clerk_id:{type: String, unique:true , required:true},
    email: {type: String, unique:true , lowercase : true},
    authenticated: {type: Boolean, default:false},
} , {timestamps: true})

const optionsSchema = new mongoose.Schema({
    text: {type: String , required : true , trim : true},

    votes_count : {type : Number , default : 0}
} , {timestamps: true})

const pollSchema = new mongoose.Schema({
    question: {type: String, required: true},
    description: {type: String},
    created_by: {type: mongoose.Schema.Types.ObjectId , ref: "User" , index: true},

    options: [optionsSchema],

    is_active: {type: Boolean},
    share_code: {type: Number, unique: true},
    qr : {type: String},

    multi_true: {type: Boolean, default: false},
    duration: {type: String, default: "Forever"},
    expires_at  : {type: Date}
}, {timestamps: true})

const votesSchema = new mongoose.Schema({
    poll_id: {type: mongoose.Schema.Types.ObjectId, ref:"Poll", required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId , ref:"User", required:true},
    option_id: {type: mongoose.Schema.Types.ObjectId , required:true},
    voted_at: {type: Date , default: Date.now}
} , {timestamps: true})

votesSchema.index({poll_id : 1});
votesSchema.index({poll_id : 1 , user_id : 1 ,option_id : 1 } , {unique: true})

const User = models.User || mongoose.model("User", userSchema, "User")
const Poll = models.Poll || mongoose.model("Poll", pollSchema, "Poll")
const Vote = models.Vote || mongoose.model("Vote", votesSchema, "Vote")

export { User, Poll, Vote }