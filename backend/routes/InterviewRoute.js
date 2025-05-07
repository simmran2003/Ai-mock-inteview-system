const express = require("express");
const { createInterview, getInterviewById, getInterviewsByUser } = require("../controllers/InterviewController");
const router = express.Router();

router.post("/create", createInterview);
router.get("/:interviewId", getInterviewById);
router.get("/", getInterviewsByUser); 

module.exports = router;