const express = require("express");
const { createInterview, getInterviewById } = require("../controllers/InterviewController");
const router = express.Router();

router.post("/create", createInterview);
router.get("/:interviewId", getInterviewById); // Add route to fetch interview details

module.exports = router;
