const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
    jobRole: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jsonResponse: {
        skills: { type: [String], default: [] }, // Only storing skills from Django response
    },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interview", InterviewSchema);
