import mongoose, { models } from "mongoose";

const pollCollection = new mongoose.Schema({
    question: {type: String, required: true},
    options: [{type: mongoose.Schema.Types.ObjectId, ref:"Option"}],
    created_by: {type: mongoose.Schema.Types.ObjectId , ref: "User"},
    is_active: {type: Boolean},
    share_code: {type: Number, unique: true},
    qr : {type: String},
    multi_true: {type: Boolean, required: true},
    duration: {type: String}
}, {timestamps: true})

const Poll = models.Poll || mongoose.model("Poll", pollCollection, "Poll")

export default Poll