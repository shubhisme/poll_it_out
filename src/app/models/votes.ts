import mongoose, { models } from "mongoose";

const votesCollection = new mongoose.Schema({
    poll_id: {type: mongoose.Schema.Types.ObjectId, ref:"Poll", unique: true},
    user_id: {type: mongoose.Schema.Types.ObjectId , ref:"User", unique:true},
    option_id: {type: mongoose.Schema.Types.ObjectId , ref:"Option", unique:true},
    voted_at: {type: Date}
} , {timestamps: true})

const Votes = models.Votes || mongoose.model("Vote" , votesCollection, "Vote");

export default Votes