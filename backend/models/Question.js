const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    questionDesc: { type: String, required: true },
    correctAnswer: { type: String },
    skill: { type: String, required: true },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true },// foreign key
    userAnswer: { type: String },
    feedback: { type: String },
    score: { type: Number, min: 0, max: 10 },
});

module.exports = mongoose.model("Question", QuestionSchema);
