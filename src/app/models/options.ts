import mongoose, { models } from "mongoose";

const optionsCollection = new mongoose.Schema({
    votes: {type: mongoose.Schema.Types.ObjectId , ref: "Votes"},
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    text: {type: String},
} , {timestamps: true})

const Options = models.Option || mongoose.model("Option", optionsCollection , "Option")

export default Options